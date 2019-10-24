const axios = require('axios');

module.exports = req => {

  if (!process.env.SLACK_WEBHOOK_URL) {
    return
  }

  axios({
    method: 'post',
    url: `https://hooks.slack.com/services/${process.env.SLACK_WEBHOOK_URL}`,
    headers: {
      'Content-Type' : 'application/json',
      'Content-Security-Policy' : "default-src 'self'; script-src https://hooks.slack.com/services/* "
    },
    data: JSON.stringify({
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
  })
  .then()
  .catch(error => console.log(error))
}