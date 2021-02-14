import React from 'react';
import { observer } from 'mobx-react-lite';
import { TitleLink } from '../components';
import { useRootStore } from '../contexts';
import { Repo } from '../models';
import './GithubPage.css';

const RepoView = ({ repo }: { repo: Repo }) => (
    <React.Fragment>
        <TitleLink href={repo.html_url}>{repo.name}</TitleLink>
        <p>{repo.description}</p>
        <p className="repo-stats">
            <em>
                {repo.language}, {repo.forks} forks, {repo.stargazers_count}{' '}
                stars
            </em>
        </p>
    </React.Fragment>
);

const GitHubPage = observer(() => {
    const rootStore = useRootStore();
    return (
        <div className="content">
            <h1 className="title">Top JavaScript Repos</h1>
            <ul className="repo-list">
                {rootStore.repoStore.repos.map((repo) => (
                    <li key={repo.node_id}>
                        <RepoView repo={repo} />
                    </li>
                ))}
            </ul>
        </div>
    );
});

export default GitHubPage;
