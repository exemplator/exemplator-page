import ScopeNode from "./scopeTree"

export default class Formatter {
    constructor(formatUnit) {
        this.formatUnit = formatUnit
    }

    format(code, expressionIdentifier, scopeEnterFunc, scopeExitFunc) {
        return this.formatSnippet(code, null, null, null, expressionIdentifier, scopeEnterFunc, scopeExitFunc)
    }

    formatSnippet(code, startRow, endRow, offset, expressionIdentifier, scopeEnterFunc, scopeExitFunc) {
        // Take string or array
        let codeArray
        if (typeof code === 'string') {
            codeArray = code.split('\n')
        } else {
            codeArray = code
        }

        // In case we have a snippet, find the snippet
        let snippetPresent = startRow !== null && endRow !== null && offset !== null
        let snippet = []
        if (snippetPresent) {
            snippet = [codeArray.slice(startRow - 1, endRow), codeArray.slice(startRow - offset - 1, endRow + offset)]
            codeArray = snippet[1]
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
        let prefixResult = this._formatPrefix(scopeTree, selection[0], codeArray, startRow - offset, scopeEnterFunc)
        let suffixResult = this._formatSuffix(scopeTree, selection[2], endRow + offset)
        let range = [prefixResult[1], suffixResult[1]]

        let selectionString = ""
        if (selection[1].length > 0) {
            selectionString = selection[1].reduce(((acc, line) => acc + '\n' + line))
        }

        return [prefixResult[0], selectionString, suffixResult[0], range]
    }

    _formatPrefix(scopeTree, array, fullCode, oldStart, scopeEnterFunc) {
        let newStart = oldStart
        if (scopeEnterFunc([array[0].trim()], 0) === 0) {
            array.unshift(fullCode[oldStart - 1])
            newStart--
        }

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
        let offset = array.length - result.length

        if (result.length > 0) {
            result = result.reduce(((acc, line) => acc + '\n' + line))
        } else {
            result = ""
        }

        newStart += offset
        return [result, newStart]
    }

    _formatSuffix(scopeTree, array, oldEnd) {
        return [array.reduce(((acc, line) => acc + '\n' + line)), oldEnd]
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

    _trimBeginning(codeArray) {
        let canTrim = true

        while (canTrim) {
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

        while (canTrim) {
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