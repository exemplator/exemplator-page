import React from "react"
import github_img from "../../../resources/img/github.png"
import npm_img from "../../../resources/img/npm.png"

export default class Footer extends React.Component {
    render() {
        return (
            <div className="footer">
                <div className="github-link">
                    <a href="https://github.com/exemplator"><img src={github_img}/></a>
                    <a href="https://github.com/exemplator"><img src={npm_img}/></a>
                </div>
            </div>
        )
    }
}