import Formatter from "./formatter"

var SCOPE_ENTER_TOKEN = '{'
var SCOPE_EXIT_TOKEN = '}'
var EXPRESSION_TERMINATION_TOKEN = ';'
var ANNOTATION_TOKEN = '@'
var COMMENT_TOKENS = ['//', '*', '/**', '*/']
var COMMENT_START_TOKEN = '/**'
var COMMENT_END_TOKEN = '*/'


var functionRegex = ""

export default class JavaFormatter extends Formatter {
    constructor(formatUnit) {
        super(formatUnit)
    }

    format(codeString) {
        super.format(codeString,
            ((codeArray, index) => this._expressionIdentifier(codeArray, index)),
            ((lines, index) => this._identifyScope(lines, index, SCOPE_ENTER_TOKEN)),
            ((lines, index) => this._identifyScope(lines, index, SCOPE_EXIT_TOKEN)))
    }

    _expressionIdentifier(codeArray, index) {
        if (codeArray.length > index) {
            let line = codeArray[index].replace('\n', '').trim()
            return line.endsWith(EXPRESSION_TERMINATION_TOKEN)
            || line.startsWith(ANNOTATION_TOKEN)
            || COMMENT_TOKENS.reduce((result, token) => result || line.includes(token), false)
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
