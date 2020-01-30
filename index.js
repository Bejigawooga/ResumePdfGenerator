function generateProfilePdf(){
    
    const axios = require('axios');
    const inquirer = require('inquirer');

    const generatePdf = require('./generatePdf.js');

    
    function promptUser(){
        
        questions = [
            {
              type: 'input',
              name: 'username',
              message: "Enter GitHub username of user you would like to generate a Resume from."
            },
            {
              type: 'input',
              name: 'color',
              message: "Choose a background color for the generated PDF",
              default: function() {
                return 'blue';
              }
            }
        ];
        

        inquirer.prompt(
                questions
            ).then(answers => {

                const userInput = answers;
                countStars(userInput);

            });
        }
    promptUser();

    function countStars(userInput){
        const {username} = userInput;
        const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;

        let gitStars = 0;

        axios.get(queryUrl).then(function({data}) {

            for(let i=0; i < data.length; i++){
                gitStars = data[i].stargazers_count + gitStars;
            }
            getUserProfile(userInput,gitStars);
        });

    }
    
    // Get the provided username github profile information
    function getUserProfile(userInput, gitStars) {
        const userColorr = userInput.color;
        const githubUsername = userInput.username;
        const githubUrlRequest = `https://api.github.com/users/${githubUsername}`; 
        

        axios.get(githubUrlRequest)
            .then(function ({data}) {
                // handle success
                const userGitData = data;
                generatePdf.userInfoHtml(userGitData, gitStars, userColorr)
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }
}
generateProfilePdf();

   