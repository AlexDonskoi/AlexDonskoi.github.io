$(function(){
     let shuffle = (array) => {
          var m = array.length, t, i;
            
          // While there remain elements to shuffle…
          while (m) {
            
            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);
            
            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
          }
            
          return array;
        };


     // questions = [{
     //    "qId": 1,
     //    "Text": "Q1",
     //    "ChoicesReq": 2,
     //    "HasImage": false,
     //    "Choices": [
     //        {
     //            "Text": "Correct 1",
     //            "isCorrect": true
     //        },
     //        {
     //           "Text": "Correct 2",
     //           "isCorrect": true
     //       },{
     //           "Text": "InCorrect ",
     //           "isCorrect": false
     //       }
     //    ]
     // },{
     //      "qId": 2,
     //      "Text": "Q2",
     //      "ChoicesReq": 2,
     //      "HasImage": false,
     //      "Choices": [
     //          {
     //              "Text": "Correct 1",
     //              "isCorrect": true
     //          },
     //          {
     //             "Text": "Correct 2",
     //             "isCorrect": true
     //         },{
     //             "Text": "InCorrect ",
     //             "isCorrect": false
     //         }
     //      ]
     //   },{
     //      "qId": 3,
     //      "Text": "Q3",
     //      "ChoicesReq": 2,
     //      "HasImage": false,
     //      "Choices": [
     //          {
     //              "Text": "Correct 1",
     //              "isCorrect": true
     //          },
     //          {
     //             "Text": "Correct 2",
     //             "isCorrect": true
     //         },{
     //             "Text": "InCorrect ",
     //             "isCorrect": false
     //         }
     //      ]
     //   }] 

     var dictionaryQuestions = questions.reduce((acc, q) => {acc[q.qId] = q; return acc;}, {});
     let init = () => shuffle(Object.keys(dictionaryQuestions));

     let restKey = "restKey";
     let failedKey = "failedKey";     
     let source = (JSON.parse(localStorage.getItem(failedKey)) ||[]).concat(JSON.parse(localStorage.getItem(restKey)) ||[]);

     // Get the template
     var template = $('#template').html();
     // Compile the template

     let $target = $('#target');
     
     let save = (qId, isCorrect) => {
          if (isCorrect){
               $badgeSuccess.html(++successCount);
               

          } else {
               $badgeFailed.html(++failCount);
          }
          let failed = (JSON.parse(localStorage.getItem(failedKey)) ||[]).filter(q => q != qId);
          if (!isCorrect){
               failed.push(qId);
          }
          localStorage.setItem(failedKey, JSON.stringify(failed));
          let rest = (JSON.parse(localStorage.getItem(restKey)) ||[]).filter(q => q != qId);
          localStorage.setItem(restKey, JSON.stringify(rest));
     }
      
     let showNext = () => {
          if (source.length == 0){
               source = init();
               localStorage.setItem(restKey, JSON.stringify(source));
          }
          let question = source.shift();
          let targetQuestion = dictionaryQuestions[question];
          targetQuestion.Choices = shuffle(targetQuestion.Choices||[]);
          var html = Mustache.render(template, targetQuestion);
          $target.html(html);
     }

     let successCount = 0;
     let failCount = 0;
     let $badgeSuccess = $('.totals .text-success');
     let $badgeFailed = $('.totals .text-danger');
     let $document = $(document)
          .on('click', ".done", function(){
               $target.removeClass("done")
               showNext()
               return false;
          })
          .on('test.done', function(_, isCorrect){
               $target.addClass("done").find('button.correct').trigger("test.show");
               save($target.find(".id").data("id"), isCorrect);
          })
          .on('test.check', function(_,){
               if (!!$target.find("button.selected:not(.correct)").length){
                    $document.trigger('test.done', [false]);
                    return;
               }

               if (!$target.find("button.correct:not(.selected)").length){
                    $document.trigger('test.done', [true]);
                    return;
               }
          })
          .on('test.show', 'button', function(){
               let $self = $(this);
               let isCorrect = $self.hasClass('correct');
               $self.removeClass('btn-outline-dark').addClass(isCorrect ? 'btn-success' : 'btn-danger');
          })
          .on('click', '#target:not(.done) button', function(){
               $(this).addClass('selected').trigger("test.show"); 
               $document.trigger('test.check');              
          });
     showNext();
})