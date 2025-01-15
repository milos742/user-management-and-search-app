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
}

class App extends Component<{}, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      isGetUsersLoading: true,
      users: [],
      filterBy: [],
      filterTerm: '',
      filterCaseSensitive: false,
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
      'id',
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
            <UserTable users={filteredUsers()} columns={visibleUserFields} />
          </div>
        </section>

      </div>
    );
  }
}

export default App;

