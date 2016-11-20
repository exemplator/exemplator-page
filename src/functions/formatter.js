import ScopeNode from "./scopeTree"

export default class Formatter {
    constructor(formatUnit) {
        this.formatUnit = formatUnit
    }

    format(code, expressionIdentifier, scopeEnterFunc, scopeExitFunc) {
        return this.formatSnippet(code, null, null, null, expressionIdentifier, scopeEnterFunc, scopeExitFunc, null, null)
    }

    formatSnippet(code, startRow, endRow, offset, expressionIdentifier, scopeEnterFunc, scopeExitFunc, identifyMethodSigFunc, identifySpecialStatement, startCommentToken, bodyCommentToken) {
        let codeArray = code.split('\n')

        // In case we have a snippet, find the snippet
        let snippetPresent = startRow !== null && endRow !== null && offset !== null
        let snippet = []
        if (snippetPresent) {
            snippet = [codeArray.slice(startRow - 1, endRow), codeArray.slice(startRow - offset - 1, endRow + offset)]
            codeArray = this._preFormatSnippet(snippet[1], snippet[0], code, startRow - offset - 1, scopeEnterFunc, identifyMethodSigFunc, startCommentToken, bodyCommentToken)
        }

        // Build and balance the scope tree
        codeArray = codeArray.map(line => line.trim())
        let scopeTree = new ScopeNode(null, null)
        scopeTree.build(codeArray.slice(), 0, scopeEnterFunc, scopeExitFunc) // copy array because it is consumed
        scopeTree.balance()

        // Init formatted array
        let formattedArray = []
        for (let i = 0; i < codeArray.length; i++) {
            formattedArray[i] = ""
        }
        this._preFormatArray(formattedArray, scopeTree, this.formatUnit)

        // Fill formatted array with code
        for (let i = 0; i < codeArray.length; i++) {
            formattedArray[i] += codeArray[i]
        }

        // Add spaces after lines that do not qualify as an expression (e.g. let str = "hello" +)
        for (let i = 0; i < formattedArray.length; i++) {
            if (!expressionIdentifier(formattedArray, i) && formattedArray.length > i + 1) {
                if (scopeEnterFunc(formattedArray, i + 1) === null && scopeExitFunc(formattedArray, i + 1) === null) {
                    formattedArray[i + 1] = this.formatUnit + formattedArray[i + 1]
                }
            }
        }

        if (!snippetPresent) {
            formattedArray = this._trimBeginning(formattedArray)
            return this._trimEnd(formattedArray)
        }

        let selection = this._splitSelection(formattedArray, snippet[0])
        let prefixResult = this._formatPrefix(scopeTree, selection[0], code, startRow - selection[0].length, startCommentToken, bodyCommentToken)
        let suffixResult = this._formatSuffix(selection[2], endRow + selection[2].length, identifySpecialStatement)
        let range = [prefixResult[1], suffixResult[1]]

        let selectionString = ""
        if (selection[1].length > 0) {
            selectionString = selection[1].reduce(((acc, line) => acc + '\n' + line))
        }

        return [prefixResult[0], selectionString, suffixResult[0], range]
    }

    _preFormatSnippet(code, selection, fullCode, startIndex, scopeEnterFunc, identifyMethodSigFunc, startCommentToken, bodyCommentToken) {
        let snippet = this._splitSelection(code, selection)
        let prefixArray = this._handleOpenComments(snippet[0], fullCode.split('\n'), startIndex, startCommentToken, bodyCommentToken)
        prefixArray = this._removeExtraMethodSigAbove(prefixArray, scopeEnterFunc, identifyMethodSigFunc)
        let suffixArray = this._removeExtraMethodSigBelow(snippet[2], identifyMethodSigFunc)
        return prefixArray.concat(snippet[1].concat(suffixArray))
    }

    _formatPrefix(scopeTree, array, oldStart) {
        let originalLength = array.length

        let limit = scopeTree.getChildren()
            .filter(node => node.getStart() === null && node.getEnd() !== null)
            .filter(node => node.getEnd() < array.length)
            .reduce((limit, current) => Math.max(limit, current.getEnd()), -1)

        let result = []
        for (let i = 0; i < array.length; i++) {
            if (i > limit) {
                result.push(array[i])
            }
        }

        result = this._trimBeginning(result)
        let offset = originalLength - result.length

        if (result.length > 0) {
            result = result.reduce(((acc, line) => acc + '\n' + line))
        } else {
            result = ""
        }

        return [result, oldStart + offset]
    }

    _formatSuffix(codeArray, oldEnd, identifySpecialStatement) {
        let originalLength = codeArray.length

        let index = codeArray.length - 1
        while (index >= 0) {
            let line = codeArray[index].trim()
            if(identifySpecialStatement(line) && line !== '') {
                codeArray.splice(index, 1)
            }

            index--
        }

        codeArray = this._trimEnd(codeArray)
        let offset = originalLength - codeArray.length

        return [codeArray.reduce(((acc, line) => acc + '\n' + line)), oldEnd - offset]
    }

    _preFormatArray(array, node) {
        let start = node.getStart()
        let end = node.getEnd()

        if (start !== null && end !== null) {
            this._fillBucketRange(array, start + 1, end - 1)
        } else if (start === null && end !== null) {
            this._fillBucketRange(array, 0, end - 1)
        } else if (start !== null && end === null) {
            this._fillBucketRange(array, start + 1, array.length - 1)
        }

        node.getChildren().forEach(child => this._preFormatArray(array, child))
    }

    _fillBucketRange(array, start, end) {
        for (let i = start; i <= end; i++) {
            array[i] += this.formatUnit
        }
    }

    _handleOpenComments(codeArray, fullCode, startLine, startCommentToken, bodyCommentToken) {
        if (codeArray.length > 0 && startLine < fullCode.length && codeArray[0].trim().startsWith(bodyCommentToken)) {
            codeArray.unshift(fullCode[startLine])
            return this._handleOpenComments(codeArray, fullCode, startLine - 1, startCommentToken, bodyCommentToken)
        } else {
            return codeArray
        }
    }

    _removeExtraMethodSigAbove(codeArray, scopeEnterFunc, identifyMethodSigFunc) {
        let methodSigCount = 0
        let index = codeArray.length - 1
        while (index >= 0) {
            let line = codeArray[index].trim()
            if (identifyMethodSigFunc(line) && methodSigCount === 0) {
                methodSigCount++
            } else if(identifyMethodSigFunc(line) && methodSigCount === 1) {
                codeArray.splice(index, 1)
                methodSigCount++
            } else if(scopeEnterFunc([line], 0) !== null && index - 1 > 0 && methodSigCount === 1) {
                if (identifyMethodSigFunc(codeArray[index - 1])) {
                    codeArray.splice(index, 1)
                    methodSigCount++
                }
            } else if(methodSigCount > 1) {
                codeArray.splice(index, 1)
            }

            index--
        }

        if (scopeEnterFunc([codeArray[0].trim()], 0) === 0) {
            codeArray.shift()
        }

        return codeArray
    }

    _removeExtraMethodSigBelow(codeArray, identifyMethodSigFunc) {
        let index = 0
        let found = false
        while (index < codeArray.length) {
            let line = codeArray[index].trim()
            if (identifyMethodSigFunc(line) || found) {
                codeArray.splice(index, 1)
                found = true
            } else {
                index++
            }
        }

        return codeArray
    }

    _trimBeginning(codeArray) {
        let canTrim = true

        while (canTrim && codeArray.length > 0) {
            let line = codeArray[0]
            if (line === "\n" || line.trim() === "") {
                codeArray.shift();
            } else {
                canTrim = false
            }
        }

        return codeArray
    }

    _trimEnd(codeArray) {
        let canTrim = true

        while (canTrim && codeArray.length > 0) {
            let line = codeArray[codeArray.length - 1]
            if (line === "\n" || line.trim() === "") {
                codeArray.pop()
            } else {
                canTrim = false
            }
        }

        return codeArray
    }

    _splitSelection(codeArray, selection) {
        let startArray = []
        let selectionArray = []
        let endArray = []
        let selectionFound = false

        codeArray.forEach(line => {
            if (selection.length !== 0) {
                if (selection.reduce((result, sLine) => result || line.includes(sLine.trim()), false)) {
                    selectionFound = true
                    selectionArray.push(line)
                } else if (selectionFound) {
                    endArray.push(line)
                } else {
                    startArray.push(line)
                }
            }
        })

        return [startArray, selectionArray, endArray];
    }
}