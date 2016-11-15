import ScopeNode from "./scopeNode"

export var formatPrefix = function(codeString, scopeEnter, scopeExit) {
    let array = codeString.split('\n');

    console.log("got here")
    let scopeTree = buildScopeTree(codeString, new ScopeNode(null, null), 0, scopeEnter, scopeExit)

    let startDefender = new ScopeNode(null, null)
    startDefender.close(array.length)

    let resultNode = traverseScopeTree(scopeTree, ((nodeChallanger, nodeDefender) => {
        let value = nodeDefender.getEnd()
        if (nodeChallanger !== null && nodeChallanger.getStart() === null && nodeChallanger.getEnd() !== null) {
            value = Math.min(nodeChallanger.getEnd(), nodeDefender.getEnd())
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

export var formatSuffix = function(codeString, scopeEnter, scopeExit) {
    let array = codeString.split('\n');
    let scopeTree = buildScopeTree(codeString, new ScopeNode(null, null), 0, scopeEnter, scopeExit)

    let startDefender = new ScopeNode(null, null)
    startDefender.close(0)

    let resultNode = traverseScopeTree(scopeTree, ((nodeChallanger, nodeDefender) => {
        let value = nodeDefender.getEnd()
        if (nodeChallanger !== null && nodeChallanger.getStart() === null && nodeChallanger.getEnd() !== null) {
            value = Math.max(nodeChallanger.getEnd(), nodeDefender.getEnd())
        }
        let newDefender = new ScopeNode(null, null)
        newDefender.close(value)
        return newDefender
    }), startDefender)

    let result = []
    for (let i = 0; i < array.length; i++) {
        if (i > resultNode.getEnd()) {
            result.push(array[i])
        }
    }

    result = trimSnippet(result.reverse()).reverse()
    return result.reduce(((acc, line) => acc + '\n' + line))
}

let trimSnippet = function(codeArray) {
    let canTrim = true
    return codeArray.filter(line => {
        if (canTrim && (line === "\n" || line === "")) {
            return false
        } else {
            canTrim = false
            return true
        }
    })
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

let buildScopeTree = function(code, node, index, scopeEnter, scopeExit) {
    let lines = code.split('\n')
    let line = lines.shift()
    let rest = ""

    if (lines.length > 0 && !node.isClosed()) {
        rest = lines.reduce(((acc, line) => acc + '\n' + line))
    } else {
        if (node.getParent() !== null) {
            return buildScopeTree("", node.getParent(), index, scopeEnter, scopeExit);
        } else {
            return node
        }
    }

    if (line.includes(scopeEnter)) {
        let child = new ScopeNode(node, index)
        node.addChild(child)

        let remaining = line.substr(line.indexOf(scopeEnter) + 1);

        if (remaining.includes(scopeEnter)) {
            return buildScopeTree(remaining, child, index, scopeEnter, scopeExit)
        } else {
            node = child // This allows us to check if the scope is closed in the same line and
                         // if not we pass on the child as the next node
        }
    }

    if (line.includes(scopeExit)) {
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
            return buildScopeTree(remaining, node.getParent(), index, scopeEnter, scopeExit)
        } else {
            node = node.getParent()
        }
    }

    return buildScopeTree(rest, node, index + 1, scopeEnter, scopeExit)
}