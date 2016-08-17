import React from 'react'
import SearchSection from "./search/SearchSection"
import Result from "./result/Result"
import Pagination from "./pagination/Pagination"
import FetchStore from '../../stores/fetchStore'
import LoadingAnimationStore from '../../stores/loadAnimationStore'
import CircularProgress from 'material-ui/CircularProgress';
var Immutable = require('immutable');

export default class Home extends React.Component {
    constructor(props) {
        super(props)
        this.start = true

        this.state = {
            loadingAnimation: "",
            codeSamples: []
        }
    }

    componentDidMount() {
        FetchStore.addChangeListener(this._updateCodeSamples.bind(this))
        LoadingAnimationStore.addChangeListener(this._handleLoadingAnimation.bind(this))
    }

    componentWillUnmount() {
        FetchStore.removeChangeListener(this._updateCodeSamples.bind(this))
        LoadingAnimationStore.addChangeListener(this._handleLoadingAnimation.bind(this))
    }
    
    _updateCodeSamples() {
        let codeSampleList = Immutable.List(FetchStore.getCodeSamples())
            // Remove duplicates - commented out for now because it makes things a lot more annoying
            // .reduce((uniqArray, item) => {
            //     if (uniqArray.some((uniqItem) => (uniqItem.codeTop === item.codeTop) 
            //             && (uniqItem.codeHighlighted === item.codeHighlighted) 
            //             && (uniqItem.codeBottom === item.codeBottom) )) {
            //         console.log("same:", item)
            //         return uniqArray
            //     }
            //    
            //     uniqArray.push(item)
            //     return uniqArray
            // }, [])
            .map(res => <Result title={res.title}
                            githubURL={res.userUrl}
                            rawURL={res.rawUrl}
                            codeTop={res.codeTop}
                            codeHighlighted={res.codeHighlighted}
                            codeBottom={res.codeBottom} />)

        this.setState({
            codeSamples: codeSampleList
        })
    }
    
    _handleLoadingAnimation() {
        let isLoading = LoadingAnimationStore.isLoading()
        
        let animation = ""
        if (isLoading) {
            animation = <CircularProgress/>
        }
        
        this.setState({
            loadingAnimation: animation,
            codeSamples: []
        })
    }
    
    render () {
        let displayIntro = "table"
        let pagination = <div></div>
        let centerContent
        if (this.start) {
            centerContent = "Try me out!"
            this.start = false
        } else if (this.state.loadingAnimation !== "") {
            centerContent = this.state.loadingAnimation
        } else if (this.state.codeSamples.size !== 0) {
            displayIntro = "none"
            pagination = <Pagination/>
        } else {
            centerContent = <div>
                                Sorry, we could not find any examples of that method.
                                <br/>
                                Are you sure you entered everything correctly?
                            </div>
        }
        
        return (
            <div className="main">
                <div className="main-hero">
                    <h1 className="main-title">Exemplator</h1>
                    <h4 className="main-subtitle">A <span className="primary-color">Java</span> coding assistant</h4>

                    <SearchSection/>
                </div>
                <div className="main-body">
                    <div className="main-body-intro-message" style={{display: displayIntro}}>
                        <div style={{display: "table-cell", verticalAlign: "middle"}}>
                            {centerContent}
                        </div>
                    </div>
                    {this.state.codeSamples}
                    {pagination}
                </div>
            </div>
        )
    }
}