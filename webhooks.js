const axios = require('axios');

module.exports.sendReportToSlack = req => {
  const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL

  if (!SLACK_WEBHOOK_URL) {
    return
  }

  const postData = {
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
}

  axios.post(SLACK_WEBHOOK_URL, postData)
  .then()
  .catch(error => console.log(error))
}