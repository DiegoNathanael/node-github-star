const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function fetchGitHubRepositories(startDate, endDate) {
    const url = 'https://api.github.com/search/repositories';
    const params = {
        q: `created:${startDate}..${endDate}`,
        sort: 'stars',
        order: 'desc',
    };

    try {
        const response = await axios.get(url, { params });
        if (response.status === 200) {
            return response.data.items;
        } else {
            console.error('Failed to fetch repositories. Status:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Failed to fetch repositories:', error.message);
        return null;
    }
}

rl.question('Enter start date (YYYY-MM-DD): ', async (startDate) => {
    rl.question('Enter end date (YYYY-MM-DD): ', async (endDate) => {
        const repositories = await fetchGitHubRepositories(startDate, endDate);

        if (repositories) {
            console.log('Top 10 repositories:');
            repositories.slice(0, 10).forEach((repo, index) => {
                console.log(`${index + 1}. ${repo.full_name} - ${repo.stargazers_count} stars`);
            });
        }

        rl.close();
    });
});
