import React from "react";
import {Card, CardHeader, CardText} from "material-ui/Card";
import SyntaxHighlighter from "react-syntax-highlighter";
import {tomorrow} from "react-syntax-highlighter/dist/styles";

export default class Result extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="result">
        <Card>
          <CardHeader
            title={this.props.title}
            subtitle={
              <div className="result-links">
                <a id="repo-link" href={this.props.repoURL}>Repo</a>
                <span>{" "}</span>
                <a id="file-link" href={this.props.fileUrl}>File</a>
              </div>
            }
            style={{paddingBottom: "0"}}
            actAsExpander={false}
            showExpandableButton={false}
          />
          <CardText expandable={false} style={{paddingTop: "0", paddingBottom: "0"}}>
            <div style={{padding: "0.5em"}}>
              <SyntaxHighlighter language='java' style={tomorrow}>
                {this.props.codeTop}
              </SyntaxHighlighter>
              <SyntaxHighlighter className="highlighted-code" language='java' style={tomorrow}>
                {this.props.codeHighlighted}
              </SyntaxHighlighter>
              <SyntaxHighlighter language='java' style={tomorrow}>
                {this.props.codeBottom}
              </SyntaxHighlighter>
            </div>
          </CardText>
        </Card>
      </div>
    )
  }
}