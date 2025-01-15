import { Component } from "react";
import { User } from "../../types/users";
import { v4 as uuid } from 'uuid';

interface UserTableProps {
    users: User[];
    columns: string[];
    onDelete: (user: User) => void;
    onEdit: (newUserData: User) => void;
    onSort: (property: string) => void;
}

interface UserTableState {
    editingUser: User;
    showDetailedUserId: number;
}

export class UserTable extends Component<UserTableProps, UserTableState> {
    constructor(props: UserTableProps) {
        super(props);
        this.state = {
            editingUser: null,
            showDetailedUserId: null,
        };
    }

    renderHeader = () => {
        return [
            ...this.props.columns.map(col => <span className="user-table__row__data header" onClick={() => this.props.onSort(col)} key={uuid()}>{col}</span>),
            <span className="user-table__row__data header" key={uuid()}>actions</span>
        ];
    }

    renderUsers = () => {
        return (
            <>
                {this.props.users.map(user => this.renderUser(user))}
            </>
        )
    }

    handleUserEdit = (user: User) => {
        if (!!this.state.editingUser) {
            this.props.onEdit({ ...user, ...this.state.editingUser });
        }
        const editingUser = this.state.editingUser?.id === user.id ? null : user;
        this.setState({ editingUser });
    }

    handleShowDetailedUserId = (userId: number) => {
        const newUserId = this.state.showDetailedUserId === userId ? null : userId;

        this.setState({
            showDetailedUserId: newUserId
        });
    }

    renderUser = (user: User) => {
        return [
            ...this.props.columns.map(col => {
                return <span className="user-table__row__data" onClick={() => this.handleShowDetailedUserId(user.id)} key={uuid()}>
                    {this.state.editingUser?.id === user.id && col !== 'id' ?
                        <input type="text"
                            value={this.state.editingUser[col]}
                            onChange={(e) => this.handleUserFieldEdit(this.state.editingUser, col, e.target.value)}
                            onClick={e => e.stopPropagation()} /> :
                        user[col]}
                </span>
            }),
            <span key={uuid()} className="user-table__row__data__actions">
                <span onClick={() => this.handleUserEdit(user)}>edit</span>
                {this.state.editingUser?.id !== user.id && <span onClick={() => this.props.onDelete(user)}>delete</span>}
            </span>,
            this.state.showDetailedUserId === user.id && this.renderDetailedRow(user)
        ]
    }

    renderDetailedRow = (user: User) => {
        return <>
            <div className="user-table__row__data--full-size" onClick={() => this.handleShowDetailedUserId(user.id)}>
                {Object.entries(user.address).map(([key, values]) => {
                    if (key === 'geo') {
                        return null;
                    }
                    return (
                        <div className="detailed-row">
                            <span className="detailed-row__key">{key}</span>
                            <span className="detailed-row__value">{values}</span>
                        </div>
                    )
                })}
            </div>
            <div className="user-table__row__data--full-size" onClick={() => this.handleShowDetailedUserId(user.id)}>
                {Object.entries(user.company).map(([key, values]) => {
                    return (
                        <div className="detailed-row">
                            <span className="detailed-row__key">{key}</span>
                            <span className="detailed-row__value">{values}</span>
                        </div>
                    )
                })}

            </div>
        </>
    }

    handleUserFieldEdit = (user: User, field: string, value: string) => {
        // TODO: this triggers rerender, therefore the input gets unfocused.
        // The solution would be a separate form for the whole row with accept or reject buttons for editing
        // Something like https://www.react-hook-form.com/ would work but not in class components
        this.setState({ editingUser: { ...user, [field]: value } })
    }

    render() {
        return (
            <div className="user-table grid">
                {this.renderHeader()}
                {this.renderUsers()}
            </div>
        )
    }
}