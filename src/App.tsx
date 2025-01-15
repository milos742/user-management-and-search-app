import { Component } from 'react';
import './App.css';
import { UsersApi } from './api'
import { Spinner } from './components/Spinner/Spinner';
import { User } from './types/users';
import { UserTable } from './components/UserTable/UserTable';
import { Filter } from './components/Filter/Filter';

interface AppState {
  isGetUsersLoading: boolean;
  users: User[];
  filterBy: string[],
  filterTerm: string,
  filterCaseSensitive: boolean,
  isSortAscending: boolean,
  sortByProperty: string;
}

class App extends Component<{}, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      isGetUsersLoading: true,
      // we're getting the users once in this case so it can be modified
      // if the editing and deleting is done on the backend side, we would get another array of users
      // and sorting would not work. In that case sorting and filtering data would be kept locally so
      // after rerendering we would see the same result
      users: [],
      filterBy: [],
      filterTerm: '',
      filterCaseSensitive: false,
      isSortAscending: false,
      sortByProperty: null,
    };
  }

  async componentDidMount() {
    const usersApi = new UsersApi();
    try {
      const response = await usersApi.getUsers();
      this.setState({ isGetUsersLoading: false, users: response.data });
    } catch (error) {
      this.setState({ users: [] });
    }
  }

  render() {
    // visibleUserFields represent fields inside user object.
    // If additional field should be shown or filtered it should be added in array
    const visibleUserFields = [
      // 'id',
      'name',
      'username',
      'email',
      'phone',
      'website',
    ]

    if (this.state.isGetUsersLoading) {
      return <Spinner />;
    }

    const handleFilterChange = (filters: { filterBy: string[], filterTerm: string, filterCaseSensitive: boolean }) => {
      this.setState(() => (
        {
          // remove undefined values
          ...JSON.parse(JSON.stringify(filters))
        }
      ))
    }

    const filterByField = (users: User[]) => {
      // filter if filterBy exists
      const term = this.state.filterCaseSensitive ? this.state.filterTerm : this.state.filterTerm.toLowerCase();
      return users.filter(user => {
        return this.state.filterBy.some((field) => {
          const fieldValue = this.state.filterCaseSensitive ? user[field] : user[field].toLowerCase();
          return fieldValue.includes(term);
        });
      });
    }

    const filterByTerm = (users: User[]) => {
      // filter if only term exists
      const term = this.state.filterCaseSensitive ? this.state.filterTerm : this.state.filterTerm.toLowerCase();
      return users.filter(user => {
        const userString = JSON.stringify(user);
        const userData = this.state.filterCaseSensitive ? userString : userString.toLowerCase()
        return userData.includes(term)
      }
      );
    }

    const filteredUsers = () => {
      let filtered = [...this.state.users];
      if (!this.state.filterTerm && (!this.state.filterBy || !!this.state.filterBy.length)) {
        // default filter if nothing is selected
        return filtered;
      } else if (!!this.state.filterBy && !!this.state.filterBy.length) {
        return filterByField(filtered);
      } else if (!!this.state.filterTerm) {
        return filterByTerm(filtered);
      }
      return filtered;
    };

    const handleDelete = (deleteUser: User) => {
      this.setState({
        users: this.state.users.filter(user => user.id !== deleteUser.id)
      });
    }

    const handleEdit = (newUserData: User) => {
      this.setState({
        users: this.state.users.map(user => {
          if (user.id === newUserData.id) {
            return newUserData;
          }
          return user;
        })
      })
    }

    const sortCompare = (a: User, b: User, property: string, isAscending: boolean) => {
      if (a[property] < b[property]) {
        return isAscending ? -1 : 1;
      }
      if (a[property] > b[property]) {
        return isAscending ? 1 : -1;
      }
      return 0;
    }

    const handleSort = (property: string) => {
      const sortByProperty = this.state.sortByProperty;
      const isSortAscending = this.state.isSortAscending;
      const isAscending = sortByProperty === property ? !isSortAscending : true;
      this.setState({ sortByProperty: property, isSortAscending: isAscending });
      const sortedUsers = [...this.state.users].sort((a, b) => sortCompare(a, b, property, isAscending));
      this.setState({ users: sortedUsers })
    }

    return (
      <div className="user-management">
        <header className="user-management__header">
          <h2>User Management</h2>
        </header>
        <section>
          <div className='user-management__filter'>
            <Filter
              columns={visibleUserFields}
              filterBy={this.state.filterBy}
              filterTerm={this.state.filterTerm}
              filterCaseSensitive={this.state.filterCaseSensitive}
              onChange={handleFilterChange}>
            </Filter>
          </div>
        </section>
        <section>
          <div className='user-management__table'>
            <UserTable users={filteredUsers()} columns={visibleUserFields} onDelete={handleDelete} onEdit={handleEdit} onSort={handleSort} />
          </div>
        </section>

      </div>
    );
  }
}

export default App;

