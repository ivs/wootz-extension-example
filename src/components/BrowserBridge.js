/* global chrome */

class BrowserBridge {
    constructor() { }

    loginWallet(email, password) {
        return this.sendMessage('loginWallet', [email, password]);
    }

    getUserProfile(token) {
        console.log('getUserProfile called with token:', token);
        return this.sendMessage('getUserProfile', [token]);
    }

    sendMessage1(method, args) {
        return new Promise((resolve, reject) => {
            const handleResponse = (response) => {
                try {
                    // Check if the response is a valid JSON
                    const responseData = JSON.parse(response);
                    if (responseData.success) {
                        if (method === 'loginWallet') {
                            resolve(responseData.data);
                        } else if (method === 'getUserProfile') {
                            resolve(responseData.profile);
                        } else {
                            resolve(responseData.data);
                        }
                    } else {
                        // Pass through the specific error message from the server
                        reject(new Error(responseData.error || responseData.message || `${method} failed`));
                    }
                } catch (error) {
                    console.error(`Error parsing ${method} response:`, error);
                    // If parsing fails, assume it's an authentication error
                    if (method === 'loginWallet') {
                        reject(new Error('Invalid Email or Password'));
                    } else {
                        reject(new Error('Error parsing server response'));
                    }
                }
            };

            // Register the callback
            if (method === 'getUserProfile') {
                window.handleProfileResponse = handleResponse;
            } else {
                window.handleResponse = handleResponse;
            }

            // Call the C++ function
            chrome.send(method, args);
        });
    }

    sendMessage(method, args) {
        console.log(method, args);
        
        if (method === "loginWallet") {
            return Promise.resolve({
                    id_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImMxNTQwYWM3MWJiOTJhYTA2OTNjODI3MTkwYWNhYmU1YjA1NWNiZWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYWR0ZXN0LTk2YWJlIiwiYXVkIjoiYWR0ZXN0LTk2YWJlIiwiYXV0aF90aW1lIjoxNzIxMzI5OTI3LCJ1c2VyX2lkIjoiR2VwRm1wVE5qQ1hIcVNzeXJJcW5hVmowUUU2MiIsInN1YiI6IkdlcEZtcFROakNYSHFTc3lySXFuYVZqMFFFNjIiLCJpYXQiOjE3MjEzMjk5MjcsImV4cCI6MTcyMTMzMzUyNywiZW1haWwiOiJqYXlhZG1pbkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiamF5YWRtaW5AZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.nEYxsJ0c_-FQzTO3nQGLziZtLUIFayZko8AZaY_A7pMGvHGNWRO_jE4-p5khpmoQahqI3DZoEp6t_9IoMPxJqR8kpUu5AWfyegj7ZRfqqRYPjJ9bL8TTNpG9r6iUS_ILKi-8N1IfLUfTUUe7snkrkdHS7HMEMT8ouVimyyD_Mz2B7Ujtm-D6r4r-6m7_UK3uKAoqisTASrv4t8p73dOKLLHjslcT02A20J11xDwJdlgsNOBlDfIOI6heOMP640HhV3BtoB-Oe9xLwbDbSkeJcjXHBHNeTxaIhFlccnD-9NwVjbrt_cPJgij1WPQIvfsBE7cff9nCSBR0VNCZKlII5w"
                });
        } else if (method === "getUserProfile") {
            console.log(args);
    
            return fetch("https://api-staging-0.gotartifact.com/v2/users/me", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${args[0]}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                return data
            })
            .catch(error => {
                console.error("Error fetching user profile:", error);
                return {
                    success: false,
                    error: error.message
                };
            });
        }
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new BrowserBridge();
        }
        return this.instance;
    }
}

export default BrowserBridge;