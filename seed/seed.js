/**
 * Database Seed Script
 *
 * This script seeds the database by reading JSON files and calling the API endpoints.
 * It requires authentication, so it signs in with a user before making authenticated requests.
 *
 * Requirements:
 * - Node.js 18+ (for native fetch support)
 * - Backend server running on http://localhost:8080
 *
 * Usage:
 *   node seed.js
 *
 * Order of operations:
 * 1. Seed users (sign up)
 * 2. Sign in with first user to get auth token
 * 3. Seed matches (create teams first, then matches)
 * 4. Seed criteria and odds (from match JSON data)
 * 5. Update match with highlightCriteria (if endpoint exists)
 */

const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:8080";
const SEED_DIR = path.join(__dirname);

// Helper function to make API requests
async function apiRequest(method, endpoint, body = null, token = null) {
	const url = `${BASE_URL}${endpoint}`;
	const options = {
		method,
		headers: {
			"Content-Type": "application/json",
		},
	};

	if (body) {
		options.body = JSON.stringify(body);
	}

	if (token) {
		options.headers["Cookie"] = `token=${token}`;
	}

	try {
		const response = await fetch(url, options);

		// Check if response has content before trying to parse JSON
		const contentType = response.headers.get("content-type");
		let data;

		if (contentType && contentType.includes("application/json")) {
			data = await response.json();
		} else {
			const text = await response.text();
			data = text ? JSON.parse(text) : {};
		}

		if (!response.ok) {
			throw new Error(
				`API Error: ${response.status} - ${JSON.stringify(data)}`
			);
		}

		return data;
	} catch (error) {
		if (error instanceof SyntaxError) {
			console.error(`Error parsing JSON response from ${method} ${url}`);
		} else {
			console.error(`Error calling ${method} ${url}:`, error.message);
		}
		throw error;
	}
}

// Helper to extract token from Set-Cookie header
function extractTokenFromResponse(response) {
	const setCookieHeader = response.headers.get("set-cookie");
	if (setCookieHeader) {
		const match = setCookieHeader.match(/token=([^;]+)/);
		if (match) {
			return match[1];
		}
	}
	return null;
}

// 1. Seed users
async function seedUsers() {
	console.log("\n=== 1. Seeding Users ===");
	const usersData = JSON.parse(
		fs.readFileSync(path.join(SEED_DIR, "user-seed.json"), "utf8")
	);

	const createdUsers = [];
	for (const user of usersData) {
		try {
			const response = await apiRequest("POST", "/auth/signup", {
				email: user.email,
				username: user.username,
				password: user.password,
			});

			if (response.data) {
				createdUsers.push(response.data);
				console.log(`✓ Created user: ${user.username} (${user.email})`);
			}
		} catch (error) {
			// User might already exist, try to sign in instead
			console.log(`⚠ User ${user.username} might already exist, skipping...`);
		}
	}

	return createdUsers;
}

// Sign in with first user to get auth token
async function signIn(email, password) {
	console.log("\n=== Signing in ===");
	try {
		const response = await fetch(`${BASE_URL}/auth/signin`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(
				`Sign in failed: ${response.status} - ${JSON.stringify(data)}`
			);
		}

		// Extract token from Set-Cookie header
		// The Set-Cookie header can be an array or a single string
		const setCookieHeader =
			response.headers.get("set-cookie") || response.headers.get("Set-Cookie");
		let token = null;

		if (setCookieHeader) {
			// Handle both string and array formats
			const cookieString = Array.isArray(setCookieHeader)
				? setCookieHeader[0]
				: setCookieHeader;
			const match = cookieString.match(/token=([^;,\s]+)/);
			if (match) {
				token = match[1];
			}
		}

		// If token not found in headers, try to get all headers for debugging
		if (!token) {
			console.warn(
				"⚠ Token not found in Set-Cookie header. Trying alternative methods..."
			);
			// Sometimes the cookie might be in a different format
			const allHeaders = {};
			response.headers.forEach((value, key) => {
				allHeaders[key] = value;
			});
			console.log("Response headers:", allHeaders);
		}

		if (!token) {
			throw new Error("Could not extract authentication token from response");
		}

		console.log(`✓ Signed in as ${email}`);
		return token;
	} catch (error) {
		console.error("Sign in error:", error.message);
		throw error;
	}
}

// Create team
async function createTeam(teamData, token) {
	const response = await apiRequest(
		"POST",
		"/teams",
		{
			name: teamData.name,
			badgeUrl: teamData.badgeUrl,
		},
		token
	);

	return response.data;
}

// 2. Seed Matches
async function seedMatches(token) {
	console.log("\n=== 2. Seeding Matches ===");
	const matchesData = JSON.parse(
		fs.readFileSync(path.join(SEED_DIR, "match-seed.json"), "utf8")
	);

	const createdMatches = [];
	const teamCache = new Map(); // Cache teams to avoid duplicates

	for (const matchData of matchesData) {
		try {
			// Create or get home team
			let homeTeam = teamCache.get(matchData.homeTeam.name);
			if (!homeTeam) {
				homeTeam = await createTeam(matchData.homeTeam, token);
				teamCache.set(matchData.homeTeam.name, homeTeam);
				console.log(`✓ Created team: ${matchData.homeTeam.name}`);
			}

			// Create or get away team
			let awayTeam = teamCache.get(matchData.awayTeam.name);
			if (!awayTeam) {
				awayTeam = await createTeam(matchData.awayTeam, token);
				teamCache.set(matchData.awayTeam.name, awayTeam);
				console.log(`✓ Created team: ${matchData.awayTeam.name}`);
			}

			// Create match
			const matchResponse = await apiRequest(
				"POST",
				"/matches",
				{
					homeTeamId: homeTeam.id,
					awayTeamId: awayTeam.id,
					homeTeamScore: matchData.homeTeamScore || 0,
					awayTeamScore: matchData.awayTeamScore || 0,
					startTime: matchData.startTime,
					endTime: matchData.endTime,
				},
				token
			);

			const createdMatch = matchResponse.data;
			createdMatches.push({
				...createdMatch,
				originalCriterion: matchData.criterion, // Store original criterion data
			});

			console.log(
				`✓ Created match: ${matchData.homeTeam.name} vs ${matchData.awayTeam.name}`
			);
		} catch (error) {
			console.error(
				`✗ Failed to create match: ${matchData.homeTeam.name} vs ${matchData.awayTeam.name}`,
				error.message
			);
		}
	}

	return createdMatches;
}

// 2.1 Seed criteria and odds
async function seedCriteriaAndOdds(matches, token) {
	console.log("\n=== 2.1. Seeding Criteria and Odds ===");

	const createdCriteria = [];

	for (const match of matches) {
		if (!match.originalCriterion) {
			continue;
		}

		try {
			const criterionData = match.originalCriterion;

			// Create criterion with odds
			const criterionResponse = await apiRequest(
				"POST",
				"/criteria",
				{
					name: criterionData.name,
					matchId: match.id,
					allowMultipleOdds: criterionData.odds.length > 1,
					odds: criterionData.odds.map((odd) => ({
						name: odd.name,
						value: odd.value,
					})),
				},
				token
			);

			const createdCriterion = criterionResponse.data;
			createdCriteria.push({
				matchId: match.id,
				criterionId: createdCriterion.id,
				criterion: createdCriterion,
			});

			console.log(
				`✓ Created criterion "${criterionData.name}" for match ${match.id}`
			);
		} catch (error) {
			console.error(
				`✗ Failed to create criterion for match ${match.id}:`,
				error.message
			);
		}
	}

	return createdCriteria;
}

// 2.2 Update match with highlightCriteria (main criterion)
async function updateMatchHighlightCriteria(matches, criteria, token) {
	console.log("\n=== 2.2. Updating Matches with Main Criterion ===");

	for (const match of matches) {
		const matchCriterion = criteria.find((c) => c.matchId === match.id);
		if (!matchCriterion) {
			continue;
		}

		try {
			// Update match with main criterion using POST /matches/:id/main-criterion
			await apiRequest(
				"POST",
				`/matches/${match.id}/main-criterion`,
				{
					criterionId: matchCriterion.criterionId,
				},
				token
			);

			console.log(
				`✓ Updated match ${match.id} with main criterion ${matchCriterion.criterionId}`
			);
		} catch (error) {
			console.error(
				`✗ Failed to update match ${match.id} with main criterion:`,
				error.message
			);
		}
	}
}

// Main seed function
async function seed() {
	console.log("Starting database seed...\n");

	try {
		// 1. Seed users
		const users = await seedUsers();

		if (users.length === 0) {
			// If no users were created, try to sign in with first user from seed file
			const usersData = JSON.parse(
				fs.readFileSync(path.join(SEED_DIR, "user-seed.json"), "utf8")
			);
			if (usersData.length > 0) {
				const firstUser = usersData[0];
				const token = await signIn(firstUser.email, firstUser.password);

				// 2. Seed Matches
				const matches = await seedMatches(token);

				// 2.1 Seed criteria and odds
				const criteria = await seedCriteriaAndOdds(matches, token);

				// 2.2 Update match with highlightCriteria
				await updateMatchHighlightCriteria(matches, criteria, token);

				console.log("\n✓ Database seed completed successfully!");
			}
		} else {
			// Sign in with first created user
			// Get password from seed file
			const usersData = JSON.parse(
				fs.readFileSync(path.join(SEED_DIR, "user-seed.json"), "utf8")
			);
			const firstUser = users[0];
			const firstUserData = usersData.find((u) => u.email === firstUser.email);
			const password = firstUserData ? firstUserData.password : "123456";

			const token = await signIn(firstUser.email, password);

			// 2. Seed Matches
			const matches = await seedMatches(token);

			// 2.1 Seed criteria and odds
			const criteria = await seedCriteriaAndOdds(matches, token);

			// 2.2 Update match with highlightCriteria
			await updateMatchHighlightCriteria(matches, criteria, token);

			console.log("\n✓ Database seed completed successfully!");
		}
	} catch (error) {
		console.error("\n✗ Seed failed:", error);
		process.exit(1);
	}
}

// Run seed if executed directly
if (require.main === module) {
	seed();
}

module.exports = { seed };
