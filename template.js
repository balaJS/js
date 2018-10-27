$(document).ready(function() {

  $("form[name='template_data_get']").on('submit',function(e) {
    e.preventDefault();
    var content1 = $($("[name='used_template']").val());
    var content2 = $($("[name='un_used_template']").val());
    
    var target1 = [];
    var target2 = [];

    var markup_arr = {
      'u_t_length': 'Used template input field count',
      'uu_t_length': 'Un used template input field count',
      'sameElem_length': 'Same field count',
      'will_be_add_length': 'Will be add field count',
      'will_be_remove_length': 'Will be remove field count',
      'sameElem': 'Same fields',
      'will_be_add': 'Will be add field on un used templete',
      'will_be_remove': 'Will be remove field on un used templete'
    };
    
    content1.children("tr").each(function(i, elem) {
      target1.push($(elem).children("td").eq(0).html());
    });

    content2.children("tr").each(function(i, elem) {
      target2.push($(elem).children("td").eq(0).html());
    });
    
    var output = calculation(target1, target2);
    
    $(".js-output").children('li').remove();
    $.each(output,function(i, elem) {
      var html = `<li>${markup_arr[i]} => ${elem}</li>`;
      $(".js-output").append(html);
    });
  });

// ****** calculation part completed ******* //
  function calculation(array1, array2) {
  var output = {
    'sameElem': [],
    'will_be_add': [],
    'will_be_remove': [],
  };

  var input1 = array1.filter(Boolean).sort();
  var input2 = array2.filter(Boolean).sort();

  const length1 = input1.length;
  const length2 = input2.length;

  if(length1 >= length2) {
    var iterator = {'cond':'add', 'max': input1, 'min': input2};
  } else {
    var iterator = {'cond':'remove', 'max': input2, 'min': input1};
  }

  for(var i=(iterator.max.length -1); i >= 0 ;i--) {
    var value = iterator.max[i];
    var pos = $.inArray(value, iterator.min);
      if( pos !== -1) {
        output.sameElem.push(value);
        if(iterator.cond === 'add') {
          input1.splice(i, 1);
          input2.splice(pos, 1);
        } else {
          input1.splice(pos, 1);
          input2.splice(i, 1);
        }
      }
  }

  output['u_t_length'] = length1;
  output['uu_t_length'] = length2;
  output['will_be_add_length'] = input1.length;
  output['will_be_remove_length'] = input2.length;
  output['sameElem_length'] = output['sameElem'].length;
  output['will_be_add'] = input1.length ? input1 : 'NULL';
  output['will_be_remove'] = input2.length ? input2 : 'NULL';

  return output;
}
});