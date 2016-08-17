import React from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import FetchStore from '../../../stores/fetchStore'
import { loadNextPage } from '../../../actions/fetchActions'

export default class Pagination extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            isLoading: false
        }
    }

    componentDidMount() {
        FetchStore.addChangeListener(this._handleDoneLoading.bind(this))
    }

    componentWillUnmount() {
        FetchStore.removeChangeListener(this._handleDoneLoading.bind(this))
    }
    
    _handleLoadMore() {
        loadNextPage()
        
        this.setState({
            isLoading: true
        })
    }

    _handleDoneLoading() {
        if (FetchStore.getPage() <= 0 ) {
            return
        }


        this.setState({
            isLoading: false
        })
    }

    render () {
        let display = "none"
        if (this.state.isLoading) {
            display = "block"
        }
        
        return (
            <div className="pagination">
                <div style={{display: display}}>
                    <CircularProgress size={0.75} />
                </div>
                <RaisedButton
                    label="Load More"
                    primary={true}
                    style={{
                        display: "block", 
                        width: "100px",
                        marginLeft: "auto", 
                        marginRight: "auto",
                        marginTop: "1.5%"
                    }}
                    labelStyle={{textTransform: "none"}}
                    disabled={this.state.isLoading}
                    onTouchTap={this._handleLoadMore.bind(this)}/>
            </div>
        )
    }
}