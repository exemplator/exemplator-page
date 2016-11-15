export default class ScopeNode {
    constructor(parent, start) {
        this.parent = parent
        this.children = []
        this.start = start
        this.end = null
    }

    getStart() {
        return this.start
    }

    getEnd() {
        return this.end
    }

    getParent() {
        return this.parent
    }

    getChildren() {
        return this.children
    }

    addChild(child) {
        this.children.push(child)
    }

    close(line)  {
        this.end = line
    }

    isClosed() {
        return this.start !== null && this.end !== null
    }
}
