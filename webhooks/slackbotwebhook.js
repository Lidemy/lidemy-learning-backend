const fetch = require('node-fetch');

module.exports = req => {
	try {
		fetch(`https://hooks.slack.com/services/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`, {
			method: "POST",
			headers: {
				'Content-Type' : 'application/json',
				'Content-Security-Policy' : "default-src 'self'; script-src https://hooks.slack.com/services/* "
			},
			body: JSON.stringify({
				"blocks": [
					{
						"type": "context",
						"elements": [
							{
								"type": "image",
								"image_url":`https://avatars0.githubusercontent.com/u/${req.user.githubId}?v=4`,
								"alt_text": req.user.nickname
							},
							{
								"type": "mrkdwn",
								"text": `*<https://lidemy-learning-center.netlify.com/users/${req.user.id}|${req.user.nickname}>*`
							}
						]
					},
					{
						"type": "section",
						"text": {
							"type": "mrkdwn",
							"text": "```" + req.body.content + "```"
						}
					},
					{
						"type": "context",
						"elements": [
							{
								"type": "mrkdwn",
								"text": "*<https://lidemy-learning-center.netlify.com/| Go lidemy-learning-center>*"
							}
						]
					}
				]
			})
		});
		console.log('success')

	} catch (e) {
		console.log('error', e)
	}
}