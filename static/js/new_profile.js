








if ($('.advocate_calender_container').length == 1) {
    
  
    $('.status_select').select2({
        minimumResultsForSearch: Infinity,
        selectOnClose: true,
        dropdownAutoWidth: true,
        width: 'resolve',
    });

    $('.status_select').on('select2:select', function (e) {
        var data = e.params.data.id;

        fetch(`/api/consultations/${$('.advocate_calender_info').attr('data-id')}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        })
        .then(data => {
            return data.json();
        })
        .then(data => {
        
        })
    });

    
    $('.communicate_select').select2({
        minimumResultsForSearch: Infinity,
        selectOnClose: true,
        dropdownAutoWidth: true,
        width: 'resolve',
    });

    $('.communicate_select').on('select2:select', function (e) {
        var data = e.params.data.id;

        fetch(`/api/consultations/${$('.advocate_calender_info').attr('data-id')}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        })
        .then(data => {
            return data.json();
        })
        .then(data => {
        
        })
    });


    
    $('.advocate_slick_date__block').slick({
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 1,
        // responsive: [
        //   {
        //     breakpoint: 1200,
        //     settings: {
        //       slidesToShow: 3,
        //       slidesToScroll: 3,
        //       infinite: true,
        //       dots: true
        //     }
        //   }
        // ]
      });
      $('.advocate_calender_arrow_1').click(function () {
        $(".advocate_slick_date__block").slick('slickPrev');
      });
      $('.advocate_calender_arrow_2').click(function () {
        $(".advocate_slick_date__block").slick('slickNext');
      });


     
// якась робота з датами, просто не лізь сюди
function generate_interval(start, end) {
    let dates_start = start.split(':');
    let dates_end = end.split(':');
    let date_start = new Date(2020, 09, 22, dates_start[0], dates_start[1], 05);
    let date_end = new Date(2020, 09, 22, dates_end[0], dates_end[1], 05);
    let diff = date_end.getTime() - date_start.getTime();
    let curent_min = diff / (1000 * 60);
    let interval = Number($('.all_calender__wrapper').attr('data-interval'));
    let result = curent_min / interval
    return result;
}

    create_all_calender(true);

       
           

   function create_calender(consultation) {
    let width_item = consultation.working_hours.length;
    console.log('width_item: ', width_item);
    $('.advocate_calender_item__block').children().remove();

    let left_position = 100 / width_item;
    // let current_slides = $('.advocate_calender_time__block').find('.slick-active');
    let all_clock_calender = $('.adv_cal_time');
    
    let grid_counter = Number(consultation.hours.length);

    let current_task_width = 0;
    for (let i = 0; i < grid_counter ; i++) {
        let current_margin;
        let item_left;
        let check_active;
        let current_time = [];
        
        $.each(consultation.hours, function(index, value) {
            let current_clockworks = value.start.replace(':', '.');
            
            if (index == i) {
                $.each(all_clock_calender, function(index, sub_value) {
                    if ($(sub_value).attr('data-clock') == current_clockworks) {
                        current_time.push(current_clockworks);
                        current_margin = index;
                    } else {

                    }
                });
                item_left = (left_position * current_margin);

                
                current_task_width = generate_interval(value.start, value.end);
            }
        });
        if (current_time.length == 0) {
            check_active = false;
        } else {
            check_active = true;
        }
        let test_json = {
            current_width: left_position,
            current_transition: current_task_width,
            left: item_left,
            info: consultation.hours[i],
        }
        if (check_active == true) {
            $('.advocate_calender_item__block')[0].appendChild(create_row_item(test_json));
        }
    }

    function create_row_item(content) {
        console.log('content: ', content);
        let advocate_calender_item_prof = document.createElement('div');
        advocate_calender_item_prof.classList.add('advocate_calender_item_prof');
        advocate_calender_item_prof.setAttribute(`data-clockwork`, content.info.start.replace(':', '.'));
    
        let advocate_calender_task = document.createElement('div');
        $(advocate_calender_task).css('left', `${content.left}%`);
        $(advocate_calender_task).css('width', `${(content.current_width * content.current_transition) - 2}%`);
        advocate_calender_task.classList.add('advocate_calender_task');
        advocate_calender_task.setAttribute(`data-id`, content.info.consultation_id);
    

        advocate_calender_item_prof.appendChild(advocate_calender_task);
    
        for (let i = 0; i < 11; i++) {
            let adv_cal_item = document.createElement('div');
            adv_cal_item.classList.add('adv_cal_item');
        
            let grid_inner = document.createElement('div');
            grid_inner.classList.add('grid_inner');
    
            advocate_calender_item_prof.appendChild(adv_cal_item);
            adv_cal_item.appendChild(grid_inner);
        }
    

        $(advocate_calender_task).on('click', function() {
            $('.advocate_calender_task').removeClass('advocate_calender_task_active');
            $(this).addClass('advocate_calender_task_active');


            let wrap = $(this).parents('.advocate_calender_item_prof');
            let table_task = $('.advocate_calender_info');
            let id = Number($(wrap).attr('data-clockwork'));
            let fetch_id = $(this).attr('data-id');
            $(table_task).css('left', '-100%');
            setTimeout(() => {
            $(table_task).css('left', '0');


            fetch(`/api/consultations/${fetch_id}/`, {
                method: "GET",
              })
              .then((data) => {
                return data.json();
              })
              .then((body) => {
                  console.log('body: ', body);
                    // зміна айді консультації
                    $('.advocate_calender_info').attr('data-id', fetch_id);
                    // зміна імені
                    $(table_task).find('.advocate_info_name').text(body.username);
                        
                    // зміна типу юзера
                    // $(table_task).find('.advocate_info_subname').text(body.type_user);

                    // зміна галузей
                    $('.branch__wrap').children().remove();
                    $.each(body.faculties, function(index, sub_value) {
                        let branch_item = document.createElement('div');
                        branch_item.classList.add('advocate_type_work', 'standart_title', 'standart_title_4', 'color_black');
                        branch_item.textContent = sub_value;
                        $('.branch__wrap')[0].appendChild(branch_item);
                    });

                    // зміна статуса
                    $('.status_select').val(body.status);
                    $('.status_select').trigger('change');

                    // зміна дати
                    $(table_task).find('.advocate_data_user_title').text(body.date);
                    
                    // зміна часу
                    $(table_task).find('.user_date_span').text(`з ${body.start} по ${body.end}.`);
                    
                    // зміна тривалості
                    $(table_task).find('.user_transition_span').text(`консультація -  ${generate_interval(body.start, body.end)} год.`);

                    // зміна комунікації
                    $('.communicate_select').val(body.format);
                    $('.communicate_select').trigger('change');

                    // зміна ціни
                    $(table_task).find('.advocate_price_span').text(body.price);

                    // зміна файлів
                    $('.info_consultation_file__block').children().remove();
                    $.each(body.documents, function(index, sub_value) {
                        let consultation_file = document.createElement('a');
                        consultation_file.classList.add('consultation_file', 'standart_title', 'standart_title_4', 'color_black');
                        consultation_file.textContent = sub_value.file_name;
                        consultation_file.setAttribute(`href`, sub_value.file_url);

                        $('.info_consultation_file__block')[0].appendChild(consultation_file);
                    });
              });   
            
                       
            }, 200);
        })
    
        return advocate_calender_item_prof;
    }

    let new_prof = $('.advocate_calender_item__block').find('.advocate_calender_item_prof');

        $.each(new_prof, function(index, value) {
            setTimeout(() => {
                $(value).css('top', '0px');
                $(value).css('max-height', '1000px');
                $(value).css('grid-template-columns', `repeat(${width_item}, 1fr)`);

            }, 200);
        });
   }


   
   
   function create_all_calender(check_calender) {
    
   

    let date_advocat = $('.advocate_slick_date_prof_active').attr('data-date');
    let id_advocat = $('.advocat_info_id').attr('data-advocat');

      fetch(`/api/get_hours_info/?date=${date_advocat}&advocat=${id_advocat}`, {
        method: "GET",
      })
      .then((data) => {
        return data.json();
      })
      .then((body) => {
          console.log('body: ', body);
          if (check_calender == true) {
            $('.all_calender__wrapper').css('opacity', '0');

            setTimeout(() => {
                $('.advocate_calender_time__block').children().remove();

                  create_time_item(body.working_hours);
            }, 200);
          }

          setTimeout(() => {
            $('.all_calender__wrapper').css('opacity', '1');
          
            let test_json = [{
              transition: 1,
              clockwork: '9.00',
              name: 'test_client1',
              type_user: 'клієнт',
              branch: ['Судова галузь', 'Податкова галузь'],
              status: 'В очікуванні',
              date: 'Середа. 15.08.2020.',
              communication: 'Skype',
              price: '1000 грн',
              files: [{
                  file_name: 'file1',
                  file_url: '/media/test_url/file1.pdf'
              },
              {
                  file_name: 'file2',
                  file_url: '/media/test_url/file2.pdf'
              }]
          }, 
          {
              transition: 1,
              clockwork: '10.00',
              name: 'test_client2',
              type_user: 'адвокат',
              branch: ['Судова галузь', 'Податкова галузь'],
              status: 'Завершено',
              date: 'Середа. 15.08.2020.',
              communication: 'GoogleMeet',
              price: '1000 грн',
              files: [{
                  file_name: 'file1',
                  file_url: '/media/test_url/file1.pdf'
              },
              {
                  file_name: 'file2',
                  file_url: '/media/test_url/file2.pdf'
              }]
          },
          {
              transition: 2,
              clockwork: '11.00',
              name: 'test_client3',
              type_user: 'клієнт',
              branch: ['Судова галузь', 'Податкова галузь'],
              status: 'В очікуванні',
              date: 'Середа. 15.08.2020.',
              communication: 'Skype',
              price: '1000 грн',
              files: [{
                  file_name: 'file1',
                  file_url: '/media/test_url/file1.pdf'
              },
              {
                  file_name: 'file2',
                  file_url: '/media/test_url/file2.pdf'
              }]
          },
          {
              transition: 1,
              clockwork: '13.00',
              name: 'test_client4',
              type_user: 'клієнт',
              branch: ['Судова галузь', 'Податкова галузь'],
              status: 'В очікуванні',
              date: 'Середа. 15.08.2020.',
              communication: 'GoogleMeet',
              price: '1000 грн',
              files: [{
                  file_name: 'file1',
                  file_url: '/media/test_url/file1.pdf'
              },
              {
                  file_name: 'file2',
                  file_url: '/media/test_url/file2.pdf'
              }]
          },
          {
              transition: 3,
              clockwork: '14.00',
              name: 'test_client5',
              type_user: 'клієнт',
              branch: ['Судова галузь', 'Податкова галузь'],
              status: 'В очікуванні',
              date: 'Середа. 15.08.2020.',
              communication: 'Skype',
              price: '1000 грн',
              files: [{
                  file_name: 'file1',
                  file_url: '/media/test_url/file1.pdf'
              },
              {
                  file_name: 'file2',
                  file_url: '/media/test_url/file2.pdf'
              }]
          },
          {
              transition: 1,
              clockwork: '17.00',
              name: 'test_client6',
              type_user: 'клієнт',
              branch: ['Судова галузь', 'Податкова галузь'],
              status: 'В очікуванні',
              date: 'Середа. 15.08.2020.',
              communication: 'Paint',
              price: '1000 грн',
              files: [{
                  file_name: 'file1',
                  file_url: '/media/test_url/file1.pdf'
              },
              {
                  file_name: 'file2',
                  file_url: '/media/test_url/file2.pdf'
              }]
          },
          {
              transition: 2,
              clockwork: '18.00',
              name: 'test_client7',
              type_user: 'клієнт',
              branch: ['Судова галузь', 'Податкова галузь'],
              status: 'В очікуванні',
              date: 'Середа. 15.08.2020.',
              communication: 'Skype',
              price: '1000 грн',
              files: [{
                  file_name: 'file1',
                  file_url: '/media/test_url/file1.pdf'
              },
              {
                  file_name: 'file2',
                  file_url: '/media/test_url/file2.pdf'
              }]
            }];
              create_calender(body);
          }, 420);
      });  
    

    function create_time_item(content) {
        $('.advocate_calender_time__block').css('grid-template-columns', `repeat(${content.length}, 1fr)`);
        $('.all_calender__wrapper').css('width', `${content.length * 50}px`);
        $('.advocate_calender_item__block').css('width', `${content.length * 50}px`);

        let product_item = "";
        $.each(content, function(index, value) {
            let new_clock = value.hour.replace(':', '.');
            product_item += `
            <div data-clock='${new_clock}' class="adv_cal_time">
                <div class="grid_inner">
                    <div class="grid_content">
                        ${new_clock}
                    </div>
                </div>
            </div>
              
            `;
          });
            
        $(".advocate_calender_time__block")[0].innerHTML = product_item;
    }

    // let new_prof = $('.adv_cal_time');

        // $.each(new_prof, function(index, value) {
        //     setTimeout(() => {
        //         $(value).css('top', '0px');
        //         $(value).css('max-height', '1000px');
        //     }, 200);
        // });
      
    
   }

    $('.advocate_slick_date_prof').on('click', function() {
        $('.advocate_slick_date_prof').removeClass('advocate_slick_date_prof_active');
        $(this).addClass('advocate_slick_date_prof_active');

        let old_prof = $('.advocate_calender_item__block').find('.advocate_calender_item_prof');

        $.each(old_prof, function(index, value) {
            setTimeout(() => {
                $(value).css('top', '-1000px');
                $(value).css('max-height', '0px');
            }, 200);
            setTimeout(() => {
                create_all_calender(true);
            }, 400);
        });

    });

    $('.advocate_time_arrow').on('click', function() {

        let old_prof = $('.advocate_calender_item__block').find('.advocate_calender_item_prof');

        $.each(old_prof, function(index, value) {
            setTimeout(() => {
                $(value).css('top', '-1000px');
                $(value).css('max-height', '0px');
            }, 200);
            setTimeout(() => {
                create_all_calender(false);
            }, 400);
        });

    });



    

}
// блочок який лиш для адвокатів закінчується




$('.save_data_practise_btn').on('click', function() {
    
});

function get_fetch_for_active_practise() {
    let wrap = $('.advocate_practise_content__block');
    let id_advocat = $('.advocat_info_id').attr('data-advocat');
    let active_practise = $(wrap).find('.advocate_download_prof');
    let array_practise = [];

    $.each(active_practise, function(index, value) {
        let id = $(value).find('.advocate_download_name').attr('data-id');
       array_practise.push(id);
    });

    let json = {
        advocat_id: id_advocat,
        faculty_ids: array_practise
    }

     fetch('/api/set_advocate_faculties/', {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
    })
    .then(data => {
        return data.json();
    })
    .then(data => {
       
    })
}


$('.file_photo').on('change', function() {
    let id = $('.advocat_info_id').attr('data-advocat');
    let Formdata = new FormData();
    let fileData = this.files[0];
    console.log('fileData: ', fileData);
    Formdata.append(`image`, fileData);
   
        fetch(`/api/users/${id}/`, {
        method: 'PATCH',
        body: Formdata,
        })
        .then(data => {
            return data.json();
        })
        .then(data => {
          $('.photo_advocate').attr('src', data.image)
        })
});
$('.cancel_this_consultation').on('click', function() {
    let wrap = $(this).parents('.consultation_prof');
    let id = $(wrap).attr('data-id');
    let data_json = {
        status: 'DECLINED'
    }
        fetch(`/api/consultations/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data_json),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        })
        .then(data => {
            return data.json();
        })
        .then(data => {
            $('.status_advocate_subname').text(data_json.status);
        })       
});

$('.check_star_btn').on('click', function() {
    let wrap = $(this).parents('.consultation_prof');
    let consultation_id = $(wrap).attr('data-id');
    let star_value = Number($(this).attr('data-value'));
    let data_json = {
        mark: star_value
    }
    
        fetch(`/api/consultations/${consultation_id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data_json),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        })
        .then(data => {
            return data.json();
        })
        .then(data => {
        
        })
});

$('.delete_this_consultation').on('click', user_delete);
   
function user_delete() {
    $.fancybox.open({
        src: '#modal_delete_consultation',
        touch: false,
    }); 

    let id = $(this).parents('.consultation_prof').attr('data-id');
    $('#modal_delete_consultation').attr('data-id', id);
}

$('.user_cancel').on('click', function() {
    $.fancybox.close({
        src: '#modal_delete_consultation',
    }); 
});
$('.user_acceses').on('click', function() {
    let wrap = $('#tab_33');
    let click_id = $(this).parents('#modal_delete_consultation').attr('data-id');
    fetch(`/api/consultations/${click_id}/`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        });
       
        let all_users = $(wrap).find('.consultation_prof');
    
        $.each(all_users,function(index,value){
            console.log('value: ', $(value));
              if ($(value).attr('data-id') == click_id) {
                console.log(' $(value): ',  $(value));
                $(value).remove();
                
            }
          });
        $.fancybox.close({
            src: '#modal_delete_user',
        }); 
});




let test_practise = [
    {
        name: 'договірна',
        id: 1
    },
    {
        name: 'приговірна',
        id: 2
    },
    {
        name: 'чарівна',
        id: 3
    },
    {
        name: 'логішна',
        id: 4
    },
    {
        name: 'антична',
        id: 5
    },
]

let test_advocate = [
    {
        name: 'advocate1',
        id: [2, 3, 4, 5]
    },
    {
        name: 'advocate2',
        id: [1, 3]
    },
    {
        name: 'advocate3',
        id: [1, 2, 3, 5]
    },
    {
        name: 'advocate4',
        id: [5]
    },
]

function remove_active_block(wrap) {
    let parents = $(wrap);
    $(parents).removeClass('step_select_active');
    $(parents).find('.step_active_content').text('');      
}
function generate_practise(id) {
    console.log('id: ', id);
    let url;
    if (id == undefined) {
        url = '/api/faculties/'
    } else {
        url = `/api/faculties/?advocat_id=${id}`
    }
    fetch(url, {
        method: "GET",
      })
      .then((data) => {
        return data.json();
      })
      .then((body) => {
          create_all_doc_for_client('.practise_step_hidden_content', body);
      });    
      
        remove_active_block('.pract_step_select');
}
function generate_advocate(id) {
    let url;
    if (id == undefined) {
        // url = '/api/users/?role=advocat';

        $('.hidden_message').text('Оберіть галузь');
    } else {
        $('.hidden_message').text('');
        url = `/api/users/?faculty_ids=[${id}]`;

        fetch(url, {
            method: "GET",
          })
          .then((data) => {
            return data.json();
          })
          .then((body) => {
              console.log('body: ', body);
              console.log('body.length: ', body.length);
              if (body.length == 0) {
                $('.hidden_message').text('По данній галузі адвокатів не знайдено');
              }
              let new_body = [];
              $.each(body, function(index, value) {
                new_body.push({
                    id: value.id,
                    name: value.username
                })
              });
              create_all_doc_for_client('.client_select_step_hidden_content', new_body);
              
              remove_active_block('.advoc_step_select');
          });     
    }
    
}
if ($('.practise_step_hidden_content').length >= 1) {
    generate_practise();
    generate_advocate();
}

   
function create_all_doc_for_client(wrap, json) {
    $(wrap).children().remove();
    $.each(json, function(index, value) {
        $(wrap)[0].appendChild(create_doc(value));
    });
}

function create_doc(content) {
    let doc_item = document.createElement('div');
    doc_item.setAttribute(`data-title`, content.name);
    doc_item.setAttribute(`data-id`, content.id);
    doc_item.classList.add('step_select_text', 'standart_title', 'standart_title_2', 'color_black');
    doc_item.textContent = content.name;

    $(doc_item).on('click', click_select_item);
    return doc_item;
}


function click_select_item() {
    let wrap = $(this).parents('.step_select');
    let data = $(this).attr('data-title');
    let data_id = $(this).attr('data-id');
    $(wrap).find('.step_select_text').removeClass('step_select_text_active');
    $(this).addClass('step_select_text_active');
    $(wrap).find('.step_active_content').text(data);
    $(wrap).addClass('step_select_active');
    $(wrap).find('.step_hidden_content').removeClass('step_hidden_content_active');


    let checker = $(this).parents()[0];
    console.log('checker: ', checker);
    // практики
    if ($(checker).hasClass('practise_step_hidden_content')) {
        $('.pract_step_select').find('.step_active_content').attr('data-id', $(this).attr('data-id'));
        generate_advocate(data_id);
        $('.user_advocate_type_work').text(data);
        $('.user_advocate_name').text('Оберіть адвоката');

        // create_all_doc_for_client('.client_select_step_hidden_content', test1);
        var datepicker = $('#datapicker_user').datepicker().data('datepicker');
        datepicker.destroy();
        $('.advocate_select_date').find('.step_select').removeClass('step_select_active');
        $('.advocate_select_time').find('.step_select').removeClass('step_select_active');
    }
    // адвокати
    else if ($(checker).hasClass('client_select_step_hidden_content')) {
        $('.user_advocate_name').text(data);
        $('.advoc_step_select').find('.step_active_content').attr('data-id', $(this).attr('data-id'));
        let date_js = new Date();
        let date_month = date_js.getMonth() + 1;
        let date_year = date_js.getFullYear();
        let date_client = $('.client_info_id').attr('data-client');
        let date_advocat = data_id;
        
        let advocat_days_json = {
            year: date_year,
            month: date_month,
            advocat: date_advocat,
            client: date_client,
        }
        fetch_get_data_user_calender(advocat_days_json);

        // generate_practise(data_id);
        // create_all_doc_for_client('.practise_step_hidden_content', test2);

        $('.advocate_select_date').find('.step_select').removeClass('step_select_active');
        $('.advocate_select_time').find('.step_select').removeClass('step_select_active');

        
    }


};

function fetch_get_data_user_calender(content) {
    let url = `/api/get_days_info/?year=${content.year}&month=${content.month}&advocat=${content.advocat}&client=${content.client}`;
    fetch(url, {
        method: "GET",
      })
      .then((data) => {
        return data.json();
      })
      .then((body) => {
          console.log('body: ', body);
        let datepicker = $('#datapicker_user').datepicker().data('datepicker');
        let months_items = ['january','feburary','March','April','May','June','July','August','September','November','December'];
        let weekenddDays = [0, 6];
        // reserve - повністю зайнятий
        let reserve = [];
        
        // busy - напів зайнятий
        let busy = [];
        
        // статуси 
        // blocked - зайнятий 
        // rest - зайнятий
        // partly_busy - напів зайнятий
        // free - вільний
        // unknows - вільний

        $.each(body.days, function(index, value) {
            if (value.status == 'blocked' || value.status == 'rest') {
                reserve.push(find_month(value.day));
            } else 
            if (value.status == 'partly_busy') {
                busy.push(find_month(value.day));
            }
        });
       
        console.log('busy: ', busy);
        console.log('reserve: ', reserve);
        datepicker.destroy();
        create_client_calender(weekenddDays, reserve, busy, months_items);
      }); 
}

function find_month(value) {
    const dates = value.split('-');
    let current_date;
    let current_year = dates[0];
    let current_month;
    let current_day = dates[2];
    if (dates[1] == '01') {
        current_month = 'january';
    } else if (dates[1] == '02') {
        current_month = 'feburary';
    } else if (dates[1] == '03') {
        current_month = 'March';
    } else if (dates[1] == '04') {
        current_month = 'April';
    } else if (dates[1] == '05') {
        current_month = 'May';
    } else if (dates[1] == '06') {
        current_month = 'June';
    } else if (dates[1] == '07') {
        current_month = 'July';
    } else if (dates[1] == '08') {
        current_month = 'August';
    } else if (dates[1] == '09') {
        current_month = 'September';
    } else if (dates[1] == '10') {
        current_month = 'October';
    } else if (dates[1] == '11') {
        current_month = 'November';
    } else if (dates[1] == '12') {
        current_month = 'December';
    }     
    current_date = `${current_day}-${current_month}-${current_year}`;
    return current_date;               
}

$('.docs_title_btn').on('click', function() {
    let wrap = $(this).parents('.docs__wrap');
    $(wrap).toggleClass('docs__wrap_active');
});

if ($('.advocate_user_input__block').length >= 1) {
    var datepicker = $('#datapicker_user').datepicker().data('datepicker');
        datepicker.destroy();
        var weekenddDays = [0, 6];
        var reserve = ["20-August-2020", "21-August-2020"];
        var busy = ["25-August-2020", "27-August-2020"];
        var months_items = ['january','feburary','March','April','May','June','July','August','September','October','November','December'];
        create_client_calender(weekenddDays, reserve, busy, months_items);
}

function create_clockwork_client(content) {
    console.log('content: ', content);
    let step_date_prof = document.createElement('div');

    if (content.is_free == true) {
        step_date_prof.classList.add('step_date_prof', 'button_transparent');
    } else {
        step_date_prof.classList.add('step_date_prof', 'button_transparent', 'step_date_prof_passive');
    }
    step_date_prof.setAttribute(`data-clock`, transform_clock(content.hours));
    step_date_prof.textContent = transform_clock(content.hours);

    $(step_date_prof).on('click', add_clockwork);

    return step_date_prof;
}




    

function create_client_calender(disabledDays, reserved_days, busy_days, months) {
    var myDatepicker = $('#datapicker_user').datepicker({
        moveToOtherMonthsOnSelect: false,
        multipleDates: false,
        minDate: new Date(),
        onRenderCell: function(date, cellType) {
            var currentDate = date.getDate();
            var myDate = ((date.getDate()<10)?'0':'')+date.getDate()+'-'+months[date.getMonth()]+'-'+date.getFullYear();
       
             if (reserved_days.indexOf(myDate)>-1) {
               return {
                classes: 'disable_day',
                disabled: true
               }
             } else if (busy_days.indexOf(myDate)>-1) {
                return {
                    classes: 'busy_day',
                    disabled: false,
                    html: currentDate + '<span class="dp-note"></span>'
                }
            }
            //    else if (cellType == 'day') {
            //         var day = date.getDay(),
            //         isDisabled = disabledDays.indexOf(day) != -1;
    
            //     return {
            //         disabled: isDisabled
            //     }
            // } 
            else {
               return {
                disabled: false
              }
            }
          },
        onSelect: function(formattedDate, date, inst) {
            let str_text = inst.selectedDates[0] + ' ';
            let current_day = str_text.slice(0, 3);
            let current_data;
            if (current_day == 'Mon') {
                current_data = `Понеділок. ${formattedDate}`;
            } else if (current_day == 'Tue') {
                current_data = `Вівторок. ${formattedDate}`;
            } else if (current_day == 'Wed') {
                current_data = `Середа. ${formattedDate}`;
            } else if (current_day == 'Thu') {
                current_data = `Четвер. ${formattedDate}`;
            } else if (current_day == 'Fri') {
                current_data = `П'ятниця. ${formattedDate}`;
            }
            $('.advocate_user_date').text(current_data);
            $('.advocate_user_date').attr('data-date', formattedDate);
            $('.step_access').text('');
            $('.current_clock_num').text(0);
            $('.all_price_consultation').text(0);
            $('.advocate_select_date').find('.step_select').addClass('step_select_active');
            $('.advocate_select_time').find('.step_select').removeClass('step_select_active');
    
            let test_json = [
                {
                    hours: 540,
                    reserve: false,
                },
                {
                    hours: 570,
                    reserve: true,
                },
                {
                    hours: 600,
                    reserve: false,
                },
                {
                    hours: 630,
                    reserve: false,
                },
                {
                    hours: 660,
                    reserve: false,
                },
                {
                    hours: 690,
                    reserve: false,
                },
                {
                    hours: 720,
                    reserve: false,
                },
                {
                    hours: 750,
                    reserve: false,
                },
            ]

            let client;
            let advocate;
            let current_date;
            
            if ($('.reserve_hidden_content').length >= 1) {
                current_date = $('.datapicker_user').val();
                client = $('.advocat_info_id').attr('data-advocat');
                advocate = $('.advocat_info_id').attr('data-advocat');
            } else {
                current_date = replasor_text();
                client = $('.client_info_id').attr('data-client');
                advocate = $('.advoc_step_select').find('.step_active_content').attr('data-id');
            }
            fetch(`/api/get_hours_info/?date=${current_date}&advocat=${advocate}&client=${client}`, {
                method: "GET",
              })
              .then((data) => {
                return data.json();
              })
              .then((body) => {
                  console.log('body: ', body);
                  $('.step_date__wrap').children().remove();

                  $.each(body.working_hours, function(index, value) {
                      let delete_space = value.hour.replace(/\s+/g, '');
                      let words = delete_space.split(':');
                      let date = new Date(0, 0, 0, words[0], words[1], 0);
                      let current_clock_json = {
                         hours: date.getHours() * 60 + date.getMinutes(),
                         is_free: value.is_free
                      }
                    //   if (current_clock_json.hours <= 360) {
                    //     //   в цей час потрібно спати, а не працювати
                    //   } else {
                        $('.step_date__wrap')[0].appendChild(create_clockwork_client(current_clock_json));
                    //   }
                        
                  });
              });    

         
            
        }
        
     });
}

 
function replasor_text() {
    let client_date = $('.advocate_user_date').text();
    let delete_space = client_date.replace(/\s+/g, '');
    let words_date = delete_space.split('.');
    let current_date = `${words_date[1]}.${words_date[2]}.${words_date[3]}`;
    return current_date;
}

$('.data_step_select_btn').on('click', function() {
    if ($(this).hasClass('visible')) {
        $('#datapicker_user').hide();
    } else {
        $('#datapicker_user').show();
    }
    

    $(this).toggleClass('visible');
})
// додавання файлів адвокатом
$('.advocate_doc_add_btn').on('change', function() {
    let file_create = $('#advocate_doc_add_btn')[0];
    let files = file_create.files;
    
    $.each(files, function(index, value ){
        $('.doc-block')[0].appendChild(create_advocate_files(value));
    });
});


let create_advocate_files = (content) => {
    let doc_profile = document.createElement('div');
        doc_profile.classList.add('doc-profile');

        let doc_top = document.createElement('div');
        doc_top.classList.add('doc-top');

        let doc_bot = document.createElement('div');
        doc_bot.classList.add('doc-bot');

    let doc_img_wrap = document.createElement('div');
    doc_img_wrap.classList.add('doc-img-wrap');

    let doc_img = document.createElement('img');
    doc_img.classList.add('doc-img');
    doc_img.setAttribute(`src`, '/static/img/doc.svg');


    let numbers = $('.doc-block').find('.doc-profile').length + 1;
    let doc_name = document.createElement('div');
    doc_name.classList.add('doc-name');
    doc_name.textContent = `Docum ${numbers}`;

    let doc__title = document.createElement('div');
    doc__title.classList.add('doc__title');
    doc__title.textContent = content.name;


    // let svg_span = document.createElement('span');
    // svg_span.classList.add('advocate_download_close');

    // svg_span.innerHTML = `
    //     <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512">
    //         <path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z">
    //         </path>
    //     </svg>
    // `;
    // $(svg_span).on('click', delete_file);


    doc_profile.appendChild(doc_top);
    doc_profile.appendChild(doc_bot);
    doc_top.appendChild(doc_img_wrap);
    doc_img_wrap.appendChild(doc_img);
    doc_img_wrap.appendChild(doc_name);
    doc_top.appendChild(doc__title);

    
        return doc_profile;
}



$('.pseudo_btn').click(function(e) {
	e.preventDefault();
  var nb_attachments = $('form input').length;
  var $input = $('<input type="file" name=attachment-' + nb_attachments + '>');
  $input.on('change', function(evt) {
    var f = evt.target.files[0];
    let value_object = {
        input: $(this),
        name: f.name
    }
    $('.advocate_download__block')[0].appendChild(create_client_files(value_object));
  });
  $input.hide();
  $input.trigger('click');
});




// додавання файлів клієнтом
$('.input_user_file').on('change', function() {
    
    // let fileData = this.files;
    // console.log('fileData: ', fileData);

    // let Formdata = new FormData();
    // jQuery.each(fileData, function(i, file) {
    //     Formdata.append(`document[${i}]`, file);
    //     console.log('Formdata: ', Formdata.getAll(`document[${i}]`));
    // });
    // formData.delete(name) – удаляет поле с заданным именем name,


    // fetch('/test/', {
    //     method: 'POST',
    //     body: Formdata,
    // })
    // .then(data => {
    //     return data.json();
    // })
    // .then(data => {
     
    // })

    // let file_create = $('#input_user_file')[0];
    // let files = file_create.files;
    // if (files.length == 1) {
    //     $('.new_files_info').text(`${files.length} новий файл`);
    // } else {
    //     $('.new_files_info').text(`${files.length} нових файлів`);
    // }
    // $('.new_files_users').children().remove();

    // $.each(files, function(index, value ){
    //     $('.new_files_users')[0].appendChild(create_client_files(value));
    // });
});


let create_client_files = (content) => {
    console.log('content: ', content);
    let advocate_download_prof = document.createElement('div');
        advocate_download_prof.classList.add('advocate_download_prof', 'new_advocate_download_prof');

    let advocate_download_name = document.createElement('div');
    advocate_download_name.classList.add('advocate_download_name', 'main_title', 'main_title_4', 'color_gold');
    advocate_download_name.textContent = content.name;
    

    let svg_span = document.createElement('span');
    svg_span.classList.add('advocate_download_close');

    svg_span.innerHTML = `
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512">
            <path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z">
            </path>
        </svg>
    `;
    $(svg_span).on('click', delete_file);

    $(advocate_download_prof).append($(content.input));
    advocate_download_prof.appendChild(advocate_download_name);
    advocate_download_prof.appendChild(svg_span);

    
        return advocate_download_prof;
}

$('.set-wrap').on('click', function() {
    $.fancybox.open({
        src: '#modal-change_settings',
        touch: false
    }); 
});

$('.step_change_btn').on('click', function() {
    let wrap = $(this).parents('.step_select');
    $(wrap).find('.step_hidden_content').toggleClass('step_hidden_content_active');

    let current_practise = $('.advocate_practise_content__block').find('.advocate_download_prof');
    let all_practise = $('.step_hidden_content').find('.step_select_radio');
        $.each(all_practise, function(index, all_value) {
            $.each(current_practise, function(index, current_value) {
                if ($(all_value).attr('data-id') == $(current_value).find('.advocate_download_name').attr('data-id')) {
                    $(all_value).addClass('step_select_text_active');
                }
            });
        });
});

$(".main_doc_link").on("click", function(){
    console.log(123);
    let wrap = $(this).parents('.tab-auto-content-prof');
    $(wrap).find(".main_doc_link").removeClass("main_doc_link_active");
     $(this).addClass("main_doc_link_active");

    $(wrap).find(".main_doc_content").removeClass("main_doc_content_active");
    $("#profile_"+$(this)[0].dataset.tab).addClass("main_doc_content_active");

});


$('.advocate_download_close').on('click', delete_file);

function delete_file() {
    let wrap = $(this).parents('.advocate_download_prof');
    let id = $(wrap).find('.advocate_download_name').attr('data-id');
    $(wrap).css('max-height', '0px');
    $(wrap).css('left', '-100%');

    let current_practise = $('.step_hidden_content').find('.step_select_radio');
        $.each(current_practise, function(index, value) {
            if ($(value).attr('data-id') == id) {
                $(value).removeClass('step_select_text_active');
            }
        });


    setTimeout(() => {
        $(wrap).remove();

        get_fetch_for_active_practise();
    }, 200);

}



$('.submit_wrapper').on('click', function() {
    check_user_valid();
})
$('.submit_user_order').on('click', function() {

    let all_order_vars = create_obgect_order();
    append_form_data(all_order_vars);
    fetch_order(all_order_vars);
   
});

function create_obgect_order() {

    let object = {
        Formdata: new FormData(),
        client: $('.client_info_id').attr('data-client'),
        practise: $('.pract_step_select').find('.step_active_content').attr('data-id'),
        advocate: $('.advoc_step_select').find('.step_active_content').attr('data-id'),
        date: $('.advocate_user_date').attr('data-date'),
        clock_first: $('.clock_manager_first').text().replace('.', ':'),
        clock_last: $('.clock_manager_second').text().replace('.', ':'),
        url: $('.user_order_of_advocate').attr('action'),
        csrftoken: $('.hidden_wrap_inp').find('input').val(),
        file_array: $('.new_advocate_download_prof').find('input')
    }
    return object;
}
function append_form_data(all_order_vars) {
    jQuery.each(all_order_vars.file_array, function(i, file) {
        let fileData = file.files[0];
        all_order_vars.Formdata.append(`document[${i}]`, fileData);
    });

    all_order_vars.Formdata.append(`client`, all_order_vars.client);
    all_order_vars.Formdata.append(`faculty`, all_order_vars.practise);
    all_order_vars.Formdata.append(`advocat`, all_order_vars.advocate);
    all_order_vars.Formdata.append(`date`, all_order_vars.date);
    all_order_vars.Formdata.append(`start`, all_order_vars.clock_first);
    all_order_vars.Formdata.append(`end`, all_order_vars.clock_last);
    all_order_vars.Formdata.append(`csrftoken`, all_order_vars.csrftoken);
    
    if (all_order_vars.comment != undefined) {
        all_order_vars.Formdata.append(`comment`, all_order_vars.comment); 
    }
        
}
function fetch_order(content) {
    fetch(content.url, {
        method: 'POST',
        body: content.Formdata,
    })
    .then(data => {
        return data.json();
    })
    .then(data => {
       
        if ($('.reserve_hidden_content').length >= 1) {
            console.log(12312332);
            create_all_calender(true);
        }
    })
}


function check_user_valid() {
    let all_check_items = $('.step_select');
    let all_count = $('.step_select').length;
    let counter = 0;
    $.each(all_check_items, function(index, value) {
        if ($(value).hasClass('step_select_active')) {
            counter++;
        } else {
            let error_text = $(value).attr('data-error');
            $('.sumbit_content_error').text(error_text);
            return false;
        }
        if (counter == all_count) {
            console.log("все ок");
            $('.sumbit_content_error').text('');
            $('.submit_wrapper').removeClass('submit_wrapper_error');
        } else {
            $('.submit_wrapper').addClass('submit_wrapper_error');
        }
    });
}


$('.step_date_prof').on('click', add_clockwork);

function add_clockwork() {
    let all_clockwork = $('.step_date_prof');
    let current_index;
    let before_index;
    let after_index;
    let check_active;
    if ($(this).hasClass('step_date_prof_active')) {
        check_active = true;
    } else {
        check_active = false;
    }
    $(this).toggleClass('step_date_prof_active');
    let active_clockwork = $('.step_date_prof_active');

    if (active_clockwork.length == 1) {
        current_index = Number($(this).index());
        before_index = current_index - 1;
        after_index = current_index + 1;
    } else if (active_clockwork.length >= 2) {
        current_index = undefined;
        before_index = $(active_clockwork).first().index() - 1;
        after_index = $(active_clockwork).last().index() + 1;
    }
    if ($(this).index() != before_index && $(this).index() != after_index && check_active == true) {
        $('.step_date_prof').removeClass('step_date_prof_active');
    } else {

    }
    

    

    if ($(this).hasClass('step_date_prof_passive')) {

    } else {
       
        $.each(all_clockwork, function(index, value) {
            if ($(value).hasClass('step_date_prof_passive') || $(value).hasClass('step_date_prof_active')) {
                $(value).removeClass('step_date_prof_blocked');
            } else {
                $(value).addClass('step_date_prof_blocked');
            }
        });

        if ($('.step_date_prof').hasClass('step_date_prof_passive') || $('.step_date_prof').hasClass('step_date_prof_active')) {
            
        } else {
            $('.step_date_prof').addClass('step_date_prof_blocked');
        }

        if (all_clockwork[before_index] != undefined) {
            $(all_clockwork[before_index]).removeClass('step_date_prof_blocked');
        }
        if (all_clockwork[after_index] != undefined) {
            $(all_clockwork[after_index]).removeClass('step_date_prof_blocked');
        }
        if (all_clockwork[current_index] != undefined) {
            $(all_clockwork[current_index]).removeClass('step_date_prof_blocked');
        }
            

            
        

      
        

        let attr = Number($(this).parents('.step_date__wrap').attr('data-transition'));
        let current_clock = Number($(this).parents('.step_date__block').find('.step_date__wrap').find('.step_date_prof_active').length);
        $('.step_access').text(transform_clock(current_clock * attr));
    }

    if ($('.step_date_prof_active').length == 0) {
        $('.step_date_prof').removeClass('step_date_prof_blocked');
    }
}


$('.save_reserve_date_btn').on('click', function() {
    let date_value = $('.datapicker_user').val();
    console.log('date_value: ', date_value);
    let first_clock = $('.first_advocate_user_clock').attr('data-clock');
    let second_clock = $('.second_advocate_user_clock').attr('data-clock');

    if (date_value == '') {
        $('.error_reserve').text('Вкажіть дату');
    } else if (first_clock == '0' && second_clock == '0') {
        $('.error_reserve').text('Вкажіть час');
    } else {
        $('.error_reserve').text('');

       
       

        fetch(`/api/faculties/`, {
            method: "GET",
          })
          .then((data) => {
            return data.json();
          })
          .then((body) => {
            let object = {
                Formdata: new FormData(),
                client: $('.advocat_info_id').attr('data-advocat'),
                practise: body[0].id,
                advocate: $('.advocat_info_id').attr('data-advocat'),
                date: $('.datapicker_user').val(),
                clock_first: $('.first_advocate_user_clock').attr('data-clock').replace('.', ':'),
                clock_last: $('.second_advocate_user_clock').attr('data-clock').replace('.', ':'),
                url: '/api/consultations/',
                csrftoken: $('.hidden_wrap_inp').find('input').val(),
                comment: $('.advocate_user_comment__block').find('textarea').val()
            }
              append_form_data(object);
              fetch_order(object);
              
          })

        function append_form_data(all_order_vars) {
            jQuery.each(all_order_vars.file_array, function(i, file) {
                let fileData = file.files[0];
                all_order_vars.Formdata.append(`document[${i}]`, fileData);
            });
        
            all_order_vars.Formdata.append(`client`, all_order_vars.client);
            all_order_vars.Formdata.append(`faculty`, all_order_vars.practise);
            all_order_vars.Formdata.append(`advocat`, all_order_vars.advocate);
            all_order_vars.Formdata.append(`date`, all_order_vars.date);
            all_order_vars.Formdata.append(`start`, all_order_vars.clock_first);
            all_order_vars.Formdata.append(`end`, all_order_vars.clock_last);
            all_order_vars.Formdata.append(`csrftoken`, all_order_vars.csrftoken);
        }
    }
})
$('.step_access_btn').on('click', function() {
    if ($(this).hasClass('step_advocate_btn')) {
        
            let result_clock = find_order_clock();
            
            $('.first_advocate_user_clock').text(result_clock.first);
            $('.first_advocate_user_clock').attr('data-clock', result_clock.first);
            $('.second_advocate_user_clock').text(result_clock.second);
            $('.second_advocate_user_clock').attr('data-clock', result_clock.second);

        $('.advocate_step_hidden_content').removeClass('step_hidden_content_active');
    } else {
        let current_clock = transform_minute(Number($('.step_access').text()));
        if (current_clock == 0) {
            $('.step_access').css('border', '1px solid red');
            $('.advocate_select_time').find('.step_select').removeClass('step_select_active');
            check_user_valid();
            $('.all_price_consultation').text(0);
    
        } else {
            $('.step_access').css('border', '1px solid #D2A351');
    
            let current_cost = Number($('.all_price_consultation').attr('data-advocate-cost'));
            let duration = Number($('.all_price_consultation').attr('data-advocate_duration_cost'));
    
            let current_sum = current_cost / duration;
            let sum = current_sum * current_clock;
    
            $('.advocate_select_time').find('.step_select').addClass('step_select_active');
            $('.current_clock_num').text(transform_clock(current_clock));
            $('.all_price_consultation').attr('data-price', sum);
            
            let result_clock = find_order_clock();
            
            $('.clock_manager_first').text(result_clock.first);
            $('.clock_manager_second').text(result_clock.second);
            $('.all_price_consultation').text(sum);
            // counter_num('.all_price_consultation', 1000, sum);
            check_user_valid();
        }
    }
})


function find_order_clock() {
    let result = {
        first: 0,
        second: 0
    }
    let all_clock_user = $('.step_date_prof_active');
    let first_clock;
    let second_clock;
    let transition_clock = Number($('.step_date__wrap').attr('data-transition'));
    if (all_clock_user.length == 1) {
        let first_minute = transform_minute(Number($(all_clock_user).attr('data-clock')));
        first_clock = transform_clock(first_minute);
        second_clock = transform_clock(first_minute + transition_clock);
    } else {
        let first_active = Number($(all_clock_user).first().attr('data-clock'));
        let second_active = Number($(all_clock_user).last().attr('data-clock'));
        first_clock = transform_clock(transform_minute(first_active));
        second_clock = transform_clock(transform_minute(second_active) + transition_clock);
    }
    result.first = first_clock;
    result.second = second_clock;
    return result;  
}


// className - імя класа
// duration_animation - тривалість анімації (2000)
// number - до якої кількості прокручувати
function counter_num(className, duration_animation, number) {
    $({ Counter: 0 }).animate({
      Counter: number
    }, {
      duration: duration_animation,
      easing: 'swing',
      step: function() {
        $(className).text(Math.ceil(this.Counter) + " грн");
      }
    });
  }



if ($('.step_date__block').length == 1) {
    var knob = document.querySelector('.custom-scrollbar__knob')
    var bar = document.querySelector('.custom-scrollbar__bar')
    var container = document.querySelector('.custom-scrollbar__inner')

    // When the container is scrolled
    container.addEventListener('scroll', () => {
    // If we are dragging the knob, do nothing
    if (dragging) return
    
    // Otherwise, set the knob position based on the scroll position
    knob.style.top = container.scrollTop / (container.scrollHeight - container.offsetHeight) * 100 + '%'
    })

    var dragging = false
    knob.addEventListener('mousedown', (event) => {
    dragging = {
        x: event.clientX,
        y: event.clientY
    }
    })
    window.addEventListener('mousemove', (event) => {

    if (dragging) {
        // When dragging
        event.preventDefault()
        var diff = {
        x: event.clientX - dragging.x,
        y: event.clientY - dragging.y
        }
        
        // Clamp the position of the knob to be a maximum of 
        // the knobs container, and a minimum of 0
        var newTop = Math.max(0, Math.min(knob.offsetTop + diff.y, bar.offsetHeight))
        knob.style.top = newTop + 'px'
        
        // Base the scroll offset on the knobs position
        // in relation to the knobs container
        var scrollOffset = newTop / bar.offsetHeight * (container.scrollHeight - container.offsetHeight)
        container.scrollTop = scrollOffset
        
        dragging = {
        x: event.clientX,
        y: event.clientY
        }
    }
    })
    window.addEventListener('mouseup', () => {
    dragging = false
    })
}



$('.advocate_user_clock').on('click', function() {
    let wrap = $(this).parents('.advocate_user_clock__block');
    $(wrap).find('.advocate_step_hidden_content').toggleClass('step_hidden_content_active');
});

$('.reserve_btn').on('click', function() {
    $('.reserve_hidden_content').toggleClass('reserve_hidden_content_active');
});


$('.step_select_radio').on('click', function() {
    let id_practise = $(this).attr('data-id');
    let name_practise = $(this).attr('data-title');

    if ($(this).hasClass('step_select_text_active')) {
        let current_practise = $('.advocate_practise__block').find('.advocate_download_prof');
        $.each(current_practise, function(index, value) {
            if ($(value).find(".advocate_download_name").attr('data-id') == id_practise) {
                $(value).remove();
                get_fetch_for_active_practise();
            }
        });
        $(this).removeClass('step_select_text_active');
    } else {
        $(this).addClass('step_select_text_active');
        let practise_json = {
            name: name_practise,
            id: id_practise
        }
        create_practise(practise_json);
        get_fetch_for_active_practise();
    }
   
});





let create_practise = (content) => {
    let product_item = "";
    product_item += `
    <div class="advocate_download_prof">
    <div data-id="${content.id}" class="advocate_download_name main_title main_title_4 color_gold">
        ${content.name}
    </div>
    <svg class="advocate_download_close" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>
    </div>
      
    `;       
    let old_html = $(".advocate_practise_content__block")[0].innerHTML;
    $(".advocate_practise_content__block")[0].innerHTML = old_html + product_item;

    $('.advocate_download_close').on('click', delete_file);

}


function transform_clock(date) {
    let current_clock = date;

    let hours = Math.trunc(current_clock / 60);
    let minute = Math.round((current_clock / 60 - hours) * 60);
    let last;
    if (minute <= 9) {
        last = `0${minute}`;
    } else {
        last = minute;
    }
    current_clock = `${hours}.${last}`;

    return current_clock;
}

function transform_minute(date) {
    let current_clock = date;

    let hours = Math.trunc(current_clock) * 60;
    let minute = (current_clock - Math.trunc(current_clock)) * 100;
    
    current_clock = Math.round(hours + minute);

    return current_clock;
}