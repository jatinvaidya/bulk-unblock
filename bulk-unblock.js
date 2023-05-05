const fs = require("fs");
const https = require("https");

// replace with your tenant canonical-domain
const TENANT = "my-tenant.us.auth0.com";

const IDENTIFIERS_FILE_PATH = "identifiers.txt";
const TOKEN_FILE_PATH = "token.txt";
const API_ENDPOINT = `https://${TENANT}/api/v2/user-blocks`;

// Read the identifiers from the file
const identifiers = fs
	.readFileSync(IDENTIFIERS_FILE_PATH, "utf8")
	.trim()
	.split("\n");

// Read the bearer token from the file
const token = fs.readFileSync(TOKEN_FILE_PATH, "utf8").trim();

// Send a DELETE request for each identifier
identifiers.forEach((identifier) => {
	const url = `${API_ENDPOINT}/auth0|${encodeURIComponent(identifier)}`;
	const options = {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	};
	const req = https.request(url, options, (res) => {
		console.log(`DELETE ${url} - ${res.statusCode} ${res.statusMessage}`);
	});
	req.on("error", (error) => {
		console.error(`DELETE ${url} - Error: ${error}`);
	});
	req.end();
});
