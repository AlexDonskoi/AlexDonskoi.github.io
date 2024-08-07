
const template = document.getElementById('template').innerHTML;
const target = document.getElementById('target');
  
function render(question) {
  target.innerHTML = Mustache.render(template, question);
}
function start(){ render(questions[0]) };

function next(){}
	

$('#target').on('click', 'button', function () {
     let $self = $(this);
	 let answerClass = $self.hasClass("correct") ? "btn-success" : "btn-danger";
	 $self.addClass(answerClass);
});

$('#target').on('click', '.row.done', function () {
	next();
     return false;
});
	


