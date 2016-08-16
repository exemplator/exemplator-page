import React from 'react'
import {Card, CardHeader, CardText} from 'material-ui/Card';

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
                        title="Without Avatar"
                        subtitle={
                            <div className="result-links">
                                <a id="github-link" href="http://www.google.com">GitHub</a>
                                <span>{" "}</span>
                                <a id="raw-link" href="http://www.google.com">Raw</a>
                            </div>
                        }
                        actAsExpander={false}
                        showExpandableButton={false}
                    />
                    <CardText expandable={false}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                        Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                        Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                    </CardText>
                </Card>
            </div>
        )
    }
}