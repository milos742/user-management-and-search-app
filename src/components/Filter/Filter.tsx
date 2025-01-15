import { Component } from "react";
import { v4 as uuid } from 'uuid';

interface FilterProps {
    columns: string[];
    filterBy: string[];
    filterTerm: string;
    filterCaseSensitive: boolean;
    onChange: ({ filterBy, filterTerm, filterCaseSensitive }: { filterBy?: string[], filterTerm?: string, filterCaseSensitive?: boolean }) => void;
}

export class Filter extends Component<FilterProps> {
    constructor(props) {
        super(props);
    }

    handleTermChange = (term: string) => {
        this.props.onChange({ filterTerm: term });
    }

    handleFilterByChange = (selectedField: string) => {
        let selected = [...this.props.filterBy];
        if (selected.includes(selectedField)) {
            selected = selected.filter(field => field !== selectedField);
        } else {
            selected.push(selectedField);
        }
        this.props.onChange({ filterBy: selected });
    }

    handleCaseSensitiveChange = (isCaseSensitive: boolean) => {
        this.props.onChange({ filterCaseSensitive: isCaseSensitive });
    }

    render() {
        return (
            <div className="filter">
                <div className="filter__term">
                    <input type="text" placeholder="Search" value={this.props.filterTerm} onChange={(e) => this.handleTermChange(e.target.value)} />
                </div>
                <div>
                    <span>Filter by:</span>
                    {
                        this.props.columns.map(field => {
                            const classes = `filter__chip ${this.props.filterBy?.includes(field) && 'selected'}`;
                            return <span key={uuid()} className={classes} onClick={() => this.handleFilterByChange(field)}>{field}</span>
                        })
                    }
                </div>
                {/* TODO: Error: A component is changing a controlled input to be uncontrolled. */}
                {/* <div>
                    <span>Case sensitive:</span>
                    <input type="checkbox" checked={this.props.filterCaseSensitive} onChange={(e) => this.handleCaseSensitiveChange(e.target.checked)} />
                </div> */}
            </div>
        )
    }
}