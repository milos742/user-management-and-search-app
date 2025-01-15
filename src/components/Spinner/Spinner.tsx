import { Component } from "react";

export class Spinner extends Component {
    render() {
        return (
            <div className="loading-state">
                <div className="loading"></div>
            </div>
        )
    }
}