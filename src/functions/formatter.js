import ScopeNode from "./scopeTree"

export default class Formatter {
    constructor(formatUnit) {
        this.formatUnit = formatUnit
    }

    format(codeString, expressionIdentifier, scopeEnterFunc, scopeExitFunc) {
        // Take string or array
        let codeArray
        if (typeof codeString === 'string') {
            codeArray = codeString.split('\n')
        } else {
            codeArray = codeString
        }

        // Build and balance the scope tree
        codeArray = codeArray.map(line => line.trim())
        let scopeTree = new ScopeNode(null, null)
        scopeTree.build(codeArray.slice(), 0, scopeEnterFunc, scopeExitFunc)
        scopeTree.balance()

        // Init array
        let formattedArray = []
        for (let i = 0; i < codeArray.length; i++) {
            formattedArray[i] = ""
        }

        this._feedBucket(formattedArray, scopeTree, this.formatUnit)

        for (let i = 0; i < codeArray.length; i++) {
            formattedArray[i] += codeArray[i]
        }

        for (let i = 0; i < formattedArray.length; i++) {
            if (!expressionIdentifier(formattedArray, i) && formattedArray.length > i + 1) {
                if (scopeEnterFunc(formattedArray, i + 1) === null && scopeExitFunc(formattedArray, i + 1) === null) {
                    formattedArray[i + 1] = this.formatUnit + formattedArray[i + 1]
                }
            }
        }

        formattedArray = this._trimSnippet(formattedArray)
        return this._trimSnippet(formattedArray.reverse()).reverse()
    }

    // formatPrefix(scopeTree, selectionIndex) {
    //     let array = codeString.split('\n');
    //     let scopeTree = buildScopeTree(array.slice(), new ScopeNode(null, null), 0, scopeEnterFunc, scopeExitFunc)
    //
    //     let startDefender = new ScopeNode(null, null)
    //     startDefender.close(array.length)
    //
    //     let resultNode = this._traverseScopeTree(scopeTree, ((nodeChallenger, nodeDefender) => {
    //         let value = nodeDefender.getEnd()
    //         if (nodeChallenger !== null && nodeChallenger.getStart() === null && nodeChallenger.getEnd() !== null) {
    //             value = Math.min(nodeChallenger.getEnd(), nodeDefender.getEnd())
    //         }
    //         let newDefender = new ScopeNode(null, null)
    //         newDefender.close(value)
    //         return newDefender
    //     }), startDefender)
    //
    //     let limit = resultNode.getEnd()
    //     if (limit === array.length) {
    //         limit = -1
    //     }
    //
    //     let result = []
    //     for (let i = 0; i < array.length; i++) {
    //         if (i > limit) {
    //             result.push(array[i])
    //         }
    //     }
    //
    //     return result.reduce(((acc, line) => acc + '\n' + line))
    // }
    //
    // formatSuffix() {
    //     // Take string or array
    //     let codeArray
    //     if (typeof codeString === 'string') {
    //         codeArray = codeString.split('\n')
    //     } else {
    //         codeArray = codeString
    //     }
    // }

    _feedBucket(array, node) {
        let start = node.getStart()
        let end = node.getEnd()

        if (start !== null && end !== null) {
            this._fillBucketRange(array, start + 1, end - 1)
        } else if (start === null && end !== null) {
            this._fillBucketRange(array, 0, end - 1)
        } else if (start !== null && end === null) {
            this._fillBucketRange(array, start + 1, array.length - 1)
        }

        node.getChildren().forEach(child => this._feedBucket(array, child))
    }

    _fillBucketRange(array, start, end) {
        for (let i = start; i <= end; i++) {
            array[i] += this.formatUnit
        }
    }

    _trimSnippet(codeArray) {
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
}