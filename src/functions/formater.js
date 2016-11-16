import ScopeNode from "./scopeNode"

export var format = function(codeString, formatUnit, expressionIdentifier, scopeEnter, scopeExit) {
    let codeArray = codeString.split('\n');
    codeArray = codeArray.map(line => line.trim())
    let scopeTree = buildScopeTree(codeArray.slice(), new ScopeNode(null, null), 0, scopeEnter, scopeExit)

    balanceScopeTree(scopeTree)

    // Init array
    let formattedArray = []
    for (let i = 0; i < codeArray.length; i++) {
        formattedArray[i] = ""
    }

    feedBucket(formattedArray, scopeTree, formatUnit)

    for (let i = 0; i < codeArray.length; i++) {
        formattedArray[i] += codeArray[i]
    }

    return formattedArray
}

export var formatPrefix = function(codeString, scopeEnter, scopeExit) {
    let array = codeString.split('\n');
    let scopeTree = buildScopeTree(array.slice(), new ScopeNode(null, null), 0, scopeEnter, scopeExit)

    let startDefender = new ScopeNode(null, null)
    startDefender.close(array.length)

    let resultNode = traverseScopeTree(scopeTree, ((nodeChallenger, nodeDefender) => {
        let value = nodeDefender.getEnd()
        if (nodeChallenger !== null && nodeChallenger.getStart() === null && nodeChallenger.getEnd() !== null) {
            value = Math.min(nodeChallenger.getEnd(), nodeDefender.getEnd())
        }
        let newDefender = new ScopeNode(null, null)
        newDefender.close(value)
        return newDefender
    }), startDefender)

    let limit = resultNode.getEnd()
    if (limit === array.length) {
        limit = -1
    }

    let result = []
    for (let i = 0; i < array.length; i++) {
        if (i > limit) {
            result.push(array[i])
        }
    }

    result = trimSnippet(result)
    return result.reduce(((acc, line) => acc + '\n' + line))
}

export var formatSuffix = function(codeString) {
    let array = codeString.split('\n');
    array = trimSnippet(array.reverse()).reverse()
    return array.reduce(((acc, line) => acc + '\n' + line))
}

let feedBucket = function(array, node, formatUnit) {
    let start = node.getStart()
    let end = node.getEnd()

    if (start !== null && end !== null) {
        fillBucketRange(array, start + 1, end - 1, formatUnit)
    } else if (start === null && end !== null) {
        fillBucketRange(array, 0, end - 1, formatUnit)
    } else if (start !== null && end === null) {
        fillBucketRange(array, start + 1, array.length - 1, formatUnit)
    }

    node.getChildren().forEach(child => feedBucket(array, child, formatUnit))
}

let fillBucketRange = function(array, start, end, formatUnit) {
    for (let i = start; i <= end; i++) {
        array[i] += formatUnit
    }
}

let trimSnippet = function(codeArray) {
    let canTrim = true
    return codeArray
        .filter(line => {
            if (canTrim && (line === "\n" || line.trim() === "")) {
                return false
            } else {
                canTrim = false
                return true
            }
        })
}

let balanceScopeTree = function(node) {
    for (let i = 0; i < node.getChildren().length; i++) {
        let child = node.getChildren()[i]

        // Check if there is a lone closing scope
        if (child.getStart() === null && child.getEnd() !== null) {
            // Pretend this lone closing scope had a matching opening scope at the beginning
            // and turn all previous siblings into children of the closing scope
            for (let j = 0; j < i; j++) {
                let sibling = node.getChildren()[0]
                node.getChildren().splice(0, 1)
                child.addChild(sibling)
            }
        }

        balanceScopeTree(child)
    }
}

let traverseScopeTree = function(node, applyFunc, acc) {
    if (node.getChildren().length > 0) {
        return node.getChildren()
            .map(node => traverseScopeTree(node, applyFunc, acc))
            .reduce((acc, node) => applyFunc(node, acc))
    } else {
        return applyFunc(node, acc)
    }
}

let buildScopeTree = function(lines, node, index, scopeEnter, scopeExit) {
    if (lines.length === 0) {
        if (node.getParent() !== null) {
            return buildScopeTree([], node.getParent(), index, scopeEnter, scopeExit);
        } else {
            return node
        }
    }

    let line = lines.shift()

    let enterIndex = line.indexOf(scopeEnter)
    let exitIndex = line.indexOf(scopeExit)

    if (enterIndex !== -1 && (enterIndex < exitIndex || exitIndex === -1)) {
        let child = new ScopeNode(node, index)
        node.addChild(child)

        let remaining = line.substr(line.indexOf(scopeEnter) + 1);
        if (remaining.includes(scopeEnter)) {
            lines.unshift(remaining)
            return buildScopeTree(lines, child, index, scopeEnter, scopeExit)
        } else {
            node = child // This allows us to check if the scope is closed in the same line and
                         // if not we pass on the child as the next node
        }
    } else if (enterIndex !== -1 && exitIndex !== -1) {
        // Check for this case: } foo {
        if (node.getParent() === null) {
            let child = new ScopeNode(node, null)
            child.close(index)
            node.addChild(child)
            node = child
        } else {
            node.close(index)
        }

        let remaining = line.substr(line.indexOf(scopeExit) + 1)
        lines.unshift(remaining)
        return buildScopeTree(lines, node.getParent(), index, scopeEnter, scopeExit)
    }

    if (exitIndex !== -1) {
        if (node.getParent() === null) {
            let child = new ScopeNode(node, null)
            child.close(index)
            node.addChild(child)
            node = child // this avoids a null pointer exception when we call node.getParent() below
        } else {
            node.close(index)
        }

        let remaining = line.substr(line.indexOf(scopeExit) + 1)

        if (remaining.includes(scopeExit)) {
            lines.unshift(remaining)
            return buildScopeTree(lines, node.getParent(), index, scopeEnter, scopeExit)
        } else {
            node = node.getParent()
        }
    }

    return buildScopeTree(lines, node, index + 1, scopeEnter, scopeExit)
}