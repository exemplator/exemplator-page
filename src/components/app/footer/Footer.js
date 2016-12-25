import React from "react"
import github_img from "../../../resources/img/github.png"
import atom_img from "../../../resources/img/atom.png"

export default class Footer extends React.Component {
    render() {
        return (
            <div className="footer">
                <div className="github-link">
                    <a href="https://github.com/exemplator"><img src={github_img}/></a>
                    {/*<a href="https://atom.io/packages/exemplator-plugin"><img src={atom_img}/></a>*/}
                </div>
            </div>
        )
    }
}