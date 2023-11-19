const { promisify } = require("util");
const readline = require("readline");

async function getTopicPer(input){
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
    
      const question = promisify(rl.question).bind(rl);

    while (true) {
        input.topicDistribution = {
          Waves: parseInt(await question("Waves: ")),
          Energy: parseInt(await question("Energy: ")),
          Algebra: parseInt(await question("Algebra: ")),
          Arithmetic: parseInt(await question("Arithmetic: ")),
          Countries: parseInt(await question("Countries: ")),
          
        };
        let total = 0;
  
        for (e in input.topicDistribution) {
          total += input.topicDistribution[e];
        }
  
        if (total === 100) {
          break;
        } else {
          console.log("\nKindly Enter Correct (%) that Sum To 100");
        }
      }
      rl.close();
}

async function getInput() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = promisify(rl.question).bind(rl);

  const input = {};

  while (true) {
    input.totalMarks = parseInt(await question("\nEnter total marks: "));
    if (Number.isInteger(input.totalMarks)) {
      break;
    } else {
      console.log("\nEnter only Numeric Value");
    }
  }

  while (true) {
    input.difficultyDistribution = {
      easy: parseInt(await question("\nEnter percentage for easy questions: ")),
      medium: parseInt(
        await question("\nEnter percentage for medium questions: ")
      ),
      hard: parseInt(await question("\nEnter percentage for hard questions: ")),
    };
    let t = 0;
    for (e in input.difficultyDistribution) {
      t += input.difficultyDistribution[e];
    }

    if (t == 100) {
      break;
    } else {
      console.log("\nKindly Enter Correct (%) that Sum To 100");
    }
  }

  const specifyTopics = (
    await question(
      "\nDo you want to specify the percentages of questions from each Topic (Y/N): "
    )
  ).toUpperCase();

  if (specifyTopics.toLowerCase() === "y") {
    console.log("\nEnter percentage distribution for each topic:");

    rl.close();
   await getTopicPer(input)
  }
  else{
  rl.close();
  }
  

  return input;
}

async function main() {

  try{

  console.log(
    "\nEasy Ques has 1 Marks , Medium Ques has 5 Marks and Hard Ques has 10 Marks"
  );

  let no_easy_ques = 0,no_med_ques = 0,no_hard_que = 0; 
  let input = {};
  let data = require("./data.json");

  while (true) {
    input = await getInput();

    no_easy_ques = (input.difficultyDistribution.easy * input.totalMarks) / 100;
    no_med_ques =
      (input.difficultyDistribution.medium * input.totalMarks) / 500;
    no_hard_que = (input.difficultyDistribution.hard * input.totalMarks) / 1000;

    if (
      no_easy_ques % 1 !== 0 ||
      no_med_ques % 1 !== 0 ||
      no_hard_que % 1 !== 0
    ) {
      console.log(
        "\n!!! Kindly Update the % weightage of Difficulty Levels or Total Marks as Question Can't be in Fraction !!!"
      );
    } else {
      break;
    }
  }
    console.log("\nInput:", input);

  let result = [];
  let total_ques=no_easy_ques+no_med_ques+no_hard_que

  console.log(
    `\nNo. of Easy , Medium and Hard Ques are  ${no_easy_ques} ,${no_med_ques}, ${no_hard_que}`
  );

  if ('topicDistribution' in input){

    let topic ={Waves: 0,
        Energy: 0,
        Algebra: 0,
        Arithmetic: 0,
        Countries: 0,
        }

    
        let flag=true
    while (true){
    
        if (!flag){
            
            await getTopicPer(input)
        }

    for(e in input.topicDistribution){
        topic[e]+= total_ques*input.topicDistribution[e]/100

        if (topic[e] % 1 !== 0) {
            flag=false
            console.log(
              "\n!!! Kindly Update the % weightage of Topics as Question Can't be in Fraction !!!"
            );
            break
          } 
    }
    console.log(`\nTopic Wise No. of Ques`,topic)


      if (flag){
        break
      }
    
    }


    while(no_easy_ques!=0 || no_med_ques!=0 || no_hard_que!=0){

    data.forEach(question => {
     

      

        if (topic[question['topic']]!=0 && no_easy_ques!=0 && question.difficulty==='Easy'){

          result.push(question)
          no_easy_ques-=1
          topic[question['topic']]-=1
        }
        else if (topic[question['topic']]!=0 && no_med_ques!=0 && question.difficulty==='Medium'){

          result.push(question)
          no_med_ques-=1
          topic[question['topic']]-=1
        }
        else if (topic[question['topic']]!=0 && no_hard_que!=0 && question.difficulty==='Hard'){

          result.push(question)
          no_hard_que-=1
          topic[question['topic']]-=1
        }


      

      
    });}

    }
    else{

      while(no_easy_ques!=0 || no_med_ques!=0 || no_hard_que!=0){
      data.forEach(element => {
       
        if (no_easy_ques!=0 && element.difficulty==='Easy'){

          result.push(element)
          no_easy_ques-=1
        }
        else if (no_med_ques!=0 && element.difficulty==='Medium'){
          result.push(element)
          no_med_ques-=1

        }
        else if (no_hard_que!=0 && element.difficulty==='Hard'){
          result.push(element)
          no_hard_que-=1

        }
        
      });
    }
    
      
    }
  
    const fs = require('fs');


  let file = JSON.stringify(result, null, 2);  // Convert array to JSON string

  fs.writeFile('output.json', file, (err) => {
      if (err) throw err;
      console.log('\nData written to file output.json');
  });

  }

  catch(err){
    console.log("\nError is ",err)

  }

  }
  


main();
