const https = require('https');

// Define the API key
const openrouterApiKey = "...";

// New function to replace query_duckduckgo
async function queryOpenRouter(prompt) {
    const data = JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct",  // You can change the model here
        // model: "qwen/qwen-2.5-72b-instruct",  // You can change the model here
        messages: [
            {
                role: "system",
                content: prompt,
            },
        ],
    });

    const options = {
        hostname: 'openrouter.ai',
        path: '/api/v1/chat/completions',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${openrouterApiKey}`,
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    resolve(json.choices[0].message.content);
                } catch (error) {
                    reject(`Error parsing response: ${error}`);
                }
            });
        });

        req.on('error', (error) => {
            reject(`Request error: ${error}`);
        });

        req.write(data);
        req.end();
    });
}

(async () => {
    // Example prompt
    const prompt = "What is the capital of France?";
    try {
        const response = await queryOpenRouter(prompt);
        console.log(response);
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
})();

module.exports = queryOpenRouter;