/**
 * Created by duoyi on 2016/9/15.
 */
$(document).ready(function () {
  $($('#search').children('input')[0]).change(inputChange);
  $($('#search').children('button')[0]).click(inputChange);
});

function inputChange(evt) {
  let key=$($('#search').children('input')[0]).val();
  $.ajax({
    'type': 'GET',
    'data': {key:key.trim()},
    'url': '/search',
    'dataType': 'json'
  })
}
