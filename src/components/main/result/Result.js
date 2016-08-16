import React from 'react'
import {Card, CardHeader, CardText} from 'material-ui/Card';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/styles';

export default class Result extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    render () {
        return (
            <div className="result">
                <Card>
                    <CardHeader
                        title={this.props.title}
                        subtitle={
                            <div className="result-links">
                                <a id="github-link" href={this.props.githubURL}>GitHub</a>
                                <span>{" "}</span>
                                <a id="raw-link" href={this.props.rawURL}>Raw</a>
                            </div>
                        }
                        style={{paddingBottom: "0"}}
                        actAsExpander={false}
                        showExpandableButton={false}
                    />
                    <CardText expandable={false} style={{paddingTop: "0", paddingBottom: "0"}}>
                        <SyntaxHighlighter language='java' style={tomorrow}>
                            {this.props.code}
                        </SyntaxHighlighter>
                    </CardText>
                </Card>
            </div>
        )
    }
}