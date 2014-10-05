# TODO form submit will login user
Template.signin.events
  'submit #signUp': (e) ->
    e.preventDefault()
    tel = document.querySelector('#tel').value;

    # strip non-digits
    tel = tel.replace(/\D/g, '');
    if tel.length == 10 || tel.length == 11
      Meteor.loginWithPassword tel, "#{tel}dtf", (err) ->
        if err
          Accounts.createUser
            username: tel,
            email: "evilkronos+dtf.#{tel}@gmail.com",
            password: "#{tel}dtf"
    else
      Meteor.Error 400, "Please enter a valid phone number"
