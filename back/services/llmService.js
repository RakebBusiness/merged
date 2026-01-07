const http = require('http');

class LLMService {
    constructor() {
        this.llmHost = process.env.LLM_HOST || 'localhost';
        this.llmPort = process.env.LLM_PORT || 8080;
        this.timeout = 60000;
    }

    async generateCompletion(prompt, options = {}) {
        const requestData = JSON.stringify({
            prompt: prompt,
            temperature: options.temperature || 0.7,
            max_tokens: options.max_tokens || 2048,
            top_p: options.top_p || 0.9,
            stop: options.stop || ['\n\n\n'],
            stream: false
        });

        return new Promise((resolve, reject) => {
            const req = http.request({
                hostname: this.llmHost,
                port: this.llmPort,
                path: '/completion',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(requestData)
                },
                timeout: this.timeout
            }, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        if (response.content) {
                            resolve(response.content);
                        } else {
                            reject(new Error('Invalid response from LLM'));
                        }
                    } catch (err) {
                        reject(new Error(`Failed to parse LLM response: ${err.message}`));
                    }
                });
            });

            req.on('error', (err) => {
                reject(new Error(`LLM request failed: ${err.message}`));
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error('LLM request timed out'));
            });

            req.write(requestData);
            req.end();
        });
    }

    async correctExercise(question, studentSolution, exerciseType) {
        const prompt = this.buildCorrectionPrompt(question, studentSolution, exerciseType);

        try {
            const response = await this.generateCompletion(prompt, {
                temperature: 0.3,
                max_tokens: 2048
            });

            return this.parseCorrectionResponse(response);
        } catch (err) {
            throw new Error(`Exercise correction failed: ${err.message}`);
        }
    }

    buildCorrectionPrompt(question, studentSolution, exerciseType) {
        const typeInstruction = exerciseType === 'code'
            ? 'This is a coding exercise. Analyze the code quality, correctness, and best practices.'
            : 'This is a text-based answer. Evaluate the accuracy, completeness, and clarity.';

        return `You are an expert teacher evaluating student work. ${typeInstruction}

Question:
${question}

Student's Solution:
${studentSolution}

Please provide:
1. EVALUATION: A detailed evaluation of the student's solution (strengths, weaknesses, errors)
2. SCORE: A score from 0-100
3. PERFECT_SOLUTION: The ideal solution or answer

Format your response EXACTLY as follows:
EVALUATION:
[Your detailed evaluation here]

SCORE: [number from 0-100]

PERFECT_SOLUTION:
[The ideal solution here]`;
    }

    parseCorrectionResponse(response) {
        const evaluationMatch = response.match(/EVALUATION:\s*([\s\S]*?)(?=SCORE:|$)/i);
        const scoreMatch = response.match(/SCORE:\s*(\d+)/i);
        const solutionMatch = response.match(/PERFECT_SOLUTION:\s*([\s\S]*?)$/i);

        const evaluation = evaluationMatch ? evaluationMatch[1].trim() : response;
        const score = scoreMatch ? parseInt(scoreMatch[1]) : null;
        const perfectSolution = solutionMatch ? solutionMatch[1].trim() : 'No perfect solution provided';

        return {
            evaluation,
            score,
            perfectSolution,
            rawResponse: response
        };
    }

    async healthCheck() {
        return new Promise((resolve) => {
            const req = http.request({
                hostname: this.llmHost,
                port: this.llmPort,
                path: '/health',
                method: 'GET',
                timeout: 5000
            }, (res) => {
                resolve(res.statusCode === 200);
            });

            req.on('error', () => {
                resolve(false);
            });

            req.on('timeout', () => {
                req.destroy();
                resolve(false);
            });

            req.end();
        });
    }
}

module.exports = new LLMService();
