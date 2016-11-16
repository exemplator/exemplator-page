import Formatter from "./formatter"

var SCOPE_ENTER_TOKEN = '{'
var SCOPE_EXIT_TOKEN = '}'
var EXPRESSION_TERMINATION_TOKEN = ';'
var ANNOTATION_TOKEN = '@'
var COMMENT_START_TOKEN = '/**'
var COMMENT_END_TOKEN = '*/'

var commentRegexString = "[/\*].*"
var functionRegexString = "(\\w[\\w<>\\[\\] ,]*)+ +(\\w)+ *\\("

export default class JavaFormatter extends Formatter {
    constructor(formatUnit) {
        super(formatUnit)
        this.commentRegex = new RegExp(commentRegexString)
        this.functionRegex = new RegExp(functionRegexString)
    }

    format(codeString) {
        return super.format(codeString,
            ((codeArray, index) => this._expressionIdentifier(codeArray, index)),
            ((lines, index) => this._identifyScope(lines, index, SCOPE_ENTER_TOKEN)),
            ((lines, index) => this._identifyScope(lines, index, SCOPE_EXIT_TOKEN)))
    }

    _expressionIdentifier(codeArray, index) {
        if (codeArray.length > index) {
            let line = codeArray[index].replace('\n', '').trim()
            return line.endsWith(EXPRESSION_TERMINATION_TOKEN)
                || line === ''
                || line.startsWith(ANNOTATION_TOKEN)
                || line.search(this.commentRegex) !== -1
                || line.search(this.functionRegex) !== -1
        }

        return false
    }

    _scopeEnterFunc(codeArray, index) {
        return this._identifyScope(codeArray, index, SCOPE_ENTER_TOKEN)
    }

    _scopeExitFunc(codeArray, index) {
        return this._identifyScope(codeArray, index,SCOPE_EXIT_TOKEN)
    }

    _identifyScope(codeArray, index, token) {
        if (codeArray.length > 0) {
            let exitIndex = codeArray[index].indexOf(token)
            if (exitIndex !== -1) {
                return exitIndex
            }
            return null
        } else {
            return null
        }
    }
}
