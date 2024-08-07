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

     //questions = questions.slice(0,10);
     let init = () => shuffle(questions.map(q => { q.Choices = shuffle(q.Choices||[]); return q;}));   
     let source = [];

     // Get the template
     var template = $('#template').html();
     // Compile the template

     let $target = $('#target');
     
      
     let showNext = () => {
          if (source.length == 0){
               source = init();
          }
          let question = source.pop();
          var html = Mustache.render(template, question);
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
               if (isCorrect){
                    $badgeSuccess.html(++successCount);

               } else {
                    $badgeFailed.html(++failCount);
               }
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
               let isSelected = $self.hasClass('selected');
               $self.removeClass('btn-outline-dark').addClass(isCorrect ? (isSelected ? 'btn-success': "btn-warning") : 'btn-danger');
          })
          .on('click', '#target:not(.done) button', function(){
               $(this).addClass('selected').trigger("test.show"); 
               $document.trigger('test.check');              
          });
     showNext();
})