import { Component } from "react";
import { User } from "../../types/users";
import { v4 as uuid } from 'uuid';

interface UserTableProps {
    users: User[];
    columns: string[];
}

export class UserTable extends Component<UserTableProps> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="user-table grid">
                {
                    this.props.columns.map(col => <span key={uuid()}>{col}</span>)
                }
                {
                    this.props.users.map(user =>
                        this.props.columns.map(col => {
                            return (
                                <span className="user-table__row" key={uuid()}>{user[col]}</span>
                            )
                        })
                    )
                }
            </div>
        )
    }
}