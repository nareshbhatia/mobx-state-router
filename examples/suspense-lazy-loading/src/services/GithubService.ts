import axios from 'axios';

const api = 'https://api.github.com';

const fetchTopRepos = async () => {
    const response = await axios.get(api + '/search/repositories', {
        params: {
            q: 'language:javascript stars:>10000',
            sort: 'stars',
            order: 'desc',
        },
    });
    return response.data.items;
};

export const GitHubService = {
    fetchTopRepos,
};
