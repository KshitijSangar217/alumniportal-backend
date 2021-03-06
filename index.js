const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const corsOptions ={
    origin:'https://my-project-kitcoek.herokuapp.com',
    credentials:true,    
    preflightContinue:false,        
    //access-control-allow-credentials:true
    optionSuccessStatus:200
}
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const db = mysql.createConnection({
    user: 'epiz_31878045',
    host: 'sql205.epizy.com',
    password: 'Alumni@123456',
    database: 'epiz_31878045_alumniportaldb'
});

app.listen(process.env.PORT || 3001, () => {
    console.log("Yey, your server is running on port 3001");
});


// LoginDetails used while logging in
app.get("/loginDetails/:id", (req, res) => {
    const id = req.params.id;
    db.query("SELECT * FROM LoginDetails WHERE PRN = ?", id, (err, result) => {
      if(err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});



// Admin operates on Student Data
// Admin reads Students  data
app.get("/getStudents", (req, res) => {
  db.query("SELECT * FROM Student", (err, result) => {
    if(err) {
      console.log(err);
    } else {
      res.send(result);
    }
  })
})

// Admin adds Student
app.post("/addStudent", (req, res) => {
  const PRN = req.body.PRN;
  const name = req.body.name;

  db.query("INSERT INTO LoginDetails (PRN, password, name, type) VALUES (?, ?, ?, ?)", 
  [PRN, 'changeme', name, 'Student'], 
  (err, result) => {
    if(err) {
      console.log(err);
    } else {
      console.log("Values Inserted");
    }
  });

  db.query("INSERT INTO Student (PRN, name) VALUES (?, ?)", [PRN, name],
  (err, result) => {
    if(err) {
      console.log(err);
    } else {
      res.send("Values Inserted");
    }
  })

});

// Admin removes student
app.delete("/removeStudent/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM LoginDetails WHERE PRN=?", id, (err, result) => {
    if(err) {
      console.log(err);
    } else {
      // res.send("Deleted");
    }
  })

  db.query("DELETE FROM Student WHERE PRN=?", id, (err, result) => {
    if(err) {
      console.log(err);
    } else {
      res.send("Deleted student");
    }
  });
});

// Admin transfers student
app.put("/transferStudent/:id", (req, res) => {
  const id = req.params.id;
  db.query("UPDATE LoginDetails SET type=? WHERE PRN=?", ['Alumni', id], (err, result) => {
    if(err) {
      console.log(err);
    } else {
      res.send(result);
    }
  })
})



// Admin opearates on Alumni Data
// Admin adds Alumni
app.post("/addAlumni", (req, res) => {
  const PRN = req.body.PRN;
  const name = req.body.name;

  db.query("INSERT INTO LoginDetails (PRN, password, name, type) VALUES (?, ?, ?, ?)", 
  [PRN, 'changeme', name, 'Alumni'], 
  (err, result) => {
    if(err) {
      console.log(err);
    } else {
      console.log("Values Inserted");
    }
  });

  db.query("INSERT INTO Alumni (PRN, name) VALUES (?, ?)", [PRN, name],
  (err, result) => {
    if(err) {
      console.log(err);
    } else {
      res.send("Values Inserted");
    }
  })

});


// Admin reads Alumni data
app.get("/getAlumni/:filter/:val", (req, res) => {
  if(req.params.filter=='all') {
    db.query("SELECT * FROM Alumni", (err, result) => {
      if(err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  }
  else {
    let query = "SELECT * FROM Alumni WHERE " + req.params.filter + " LIKE '%" + req.params.val + "%'";
    db.query(query, (err, result) => {
      if(err) {
        console.log(err);
      } else {
        res.send(result);
      }
    })
  }
});


// Admin removes alumni
app.delete("/removeAlumni/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM LoginDetails WHERE PRN=?", id, (err, result) => {
    if(err) {
      console.log(err);
    } else {
      // res.send("Deleted");
    }
  })

  db.query("DELETE FROM Alumni WHERE PRN=?", id, (err, result) => {
    if(err) {
      console.log(err);
    } else {
      res.send("Deleted alumni");
    }
  });
});



// Admin opearates on Coordinator Data
// Admin adds Coordinator
app.post("/addCoordinator", (req, res) => {
  const username = req.body.username;
  const name = req.body.name;

  db.query("INSERT INTO LoginDetails (PRN, password, name, type) VALUES (?, ?, ?, ?)", 
  [username, 'changeme', name, 'Coordinator'], 
  (err, result) => {
    if(err) {
      console.log(err);
    } else {
      console.log("Values Inserted");
    }
  });

  db.query("INSERT INTO Coordinator (username, name) VALUES (?, ?)", [username, name],
  (err, result) => {
    if(err) {
      console.log(err);
    } else {
      res.send("Values Inserted");
    }
  })

});


// Admin reads Coordinator data
app.get("/getCoordinator", (req, res) => {
  db.query("SELECT * FROM Coordinator", (err, result) => {
    if(err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


// Admin removes coordinator
app.delete("/removeCoordinator/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM LoginDetails WHERE PRN=?", id, (err, result) => {
    if(err) {
      console.log(err);
    } else {
      // res.send("Deleted");
    }
  })

  db.query("DELETE FROM Coordinator WHERE username=?", id, (err, result) => {
    if(err) {
      console.log(err);
    } else {
      res.send("Deleted coordinator");
    }
  });
});


// Everyone opearates on Internship Data
// Admin adds Coordinator
app.post("/addInternship", (req, res) => {
  const company_name = req.body.company_name;
  const position = req.body.position;
  const eligible_batches = req.body.eligible_batches;
  const eligible_branches = req.body.eligible_branches;
  const experience_required = req.body.experience_required;
  const date_posted = req.body.date_posted;
  const last_date_to_apply = req.body.last_date_to_apply;
  const registration_link = req.body.registration_link;

  db.query("INSERT INTO `Internship` (`internship_id`, `company_name`, `position`, `eligible_batches`, `eligible_branches`, `experience_required`, `date_posted`, `last_date_to_apply`, `registration_link`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)", 
  [company_name, position, eligible_batches, eligible_branches, experience_required, date_posted, last_date_to_apply, registration_link],
  (err, result) => {
    if(err) {
      console.log(err);
    } else {
      res.send("Values Inserted");
    }
  })

});


// Admin reads Coordinator data
app.get("/getInternships/:filter/:val", (req, res) => {
  console.log(req.params);
  if(req.params.filter == 'all'){
    db.query("SELECT * FROM Internship WHERE CURRENT_DATE<=last_date_to_apply;", (err, result) => {
      if(err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
    );
  }
  else {
    let query = "SELECT * FROM Internship WHERE  WHERE CURRENT_DATE<=last_date_to_apply AND " + req.params.filter + " LIKE '%" + req.params.val + "%'";
    db.query(query, (err, result) => {
      if(err) {
        console.log(err);
      } else {
        res.send(result);
      }
    })
  }
  
});




// Everyone opearates on Job Data
// Alumni, Coordinator adds Job
app.post("/addJob", (req, res) => {
  const company_name = req.body.company_name;
  const position = req.body.position;
  const eligible_batches = req.body.eligible_batches;
  const eligible_branches = req.body.eligible_branches;
  const experience_required = req.body.experience_required;
  const date_posted = req.body.date_posted;
  const last_date_to_apply = req.body.last_date_to_apply;
  const registration_link = req.body.registration_link;

  db.query("INSERT INTO `Job` (`job_id`, `company_name`, `position`, `eligible_batches`, `eligible_branches`, `experience_required`, `date_posted`, `last_date_to_apply`, `registration_link`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)", 
  [company_name, position, eligible_batches, eligible_branches, experience_required, date_posted, last_date_to_apply,registration_link],
  (err, result) => {
    if(err) {
      console.log(err);
    } else {
      res.send("Values Inserted");
    }
  })

});


// Everyone reads Job data
app.get("/getJobs/:filter/:val", (req, res) => {
  if(req.params.filter=='all')
  {
    db.query("SELECT * FROM Job WHERE CURRENT_DATE<=last_date_to_apply;", (err, result) => {
      if(err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  }

  else {
    let query = "SELECT * FROM Job WHERE CURRENT_DATE<=last_date_to_apply AND " + req.params.filter + " LIKE '%" + req.params.val + "%'";
    db.query(query, (err, result) => {
      if(err) {
        console.log(err);
      } else {
        res.send(result);
      }
    })
  }
});



// Everyone opearates on Event Data
// Coordinator adds Event
app.post("/addEvent", (req, res) => {
  let event_name = req.body.event_name;
  let description = req.body.description;
  let nature_of_event = req.body.nature_of_event;
  let organizer = req.body.organizer;
  let date_of_event = req.body.date_of_event;
  let starts_at = req.body.starts_at;
  let ends_at = req.body.ends_at;
  let venue = req.body.venue;
  let mode_of_event = req.body.mode_of_event;
  let registration_link = req.body.registration_link;

  if(nature_of_event=="") {
    nature_of_event="NULL";
  }

  if(organizer=="") {
    organizer="NULL";
  }

  if(date_of_event=="") {
    date_of_event="NULL";
  }

  if(starts_at=="") {
    starts_at="NULL";
  }

  if(ends_at=="") {
    ends_at="NULL";
  }

  if(venue=="") {
    venue="NULL";
  }

  if(mode_of_event=="") {
    mode_of_event="NULL";
  }

  if(registration_link=="") {
    registration_link="NULL";
  }

  db.query("INSERT INTO `Events` (`event_id`, `event_name`, `description`, `nature_of_event`, `organizer`, `date_of_event`, `starts_at`, `ends_at`, `venue`, `mode_of_event`, `registration_link`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
  [event_name, description, nature_of_event, organizer, date_of_event, starts_at, ends_at, venue, mode_of_event, registration_link],
  (err, result) => {
    if(err) {
      console.log(err);
    } else {
      res.send("Values Inserted");
    }
  })


});


// Everyone reads Event data
app.get("/getEvents/:filter/:val", (req, res) => {
  if(req.params.filter=='all') {
    db.query("SELECT * FROM Events WHERE CURRENT_DATE<=date_of_event;", (err, result) => {
      if(err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  }

  else {
    let query = "SELECT * FROM Events WHERE CURRENT_DATE<=date_of_event AND " + req.params.filter + " LIKE '%" + req.params.val + "%'";
    db.query(query, (err, result) => {
      if(err) {
        console.log(err);
      } else {
        res.send(result);
      }
    })
  }

});



// Everyone Change Password
app.put('/updateLoginDetails', (req, res) => {
  const id = req.body.PRN;
  const password = req.body.password;
  db.query("UPDATE LoginDetails SET password = ? WHERE PRN = ?", 
  [password, id],
  (err, result) => {
    if(err) {
      console.log(err);
    } else {
      res.send(result);
    }
  }
  )
})


// Student updates details
app.put('/updateStudentDetail', (req, res) => {
  const id = req.body.PRN;
  const name = req.body.name;
  let date_of_birth = req.body.date_of_birth==''?'NULL':req.body.date_of_birth;
  let gender = req.body.gender==''?'NULL':req.body.gender;
  let year_of_admission = req.body.year_of_admission==''?'NULL':req.body.year_of_admission;
  let department = req.body.department==''?'NULL':req.body.department;
  let current_study_year = (req.body.current_study_year=='' || req.body.current_study_year==undefined)?'NULL':req.body.current_study_year;
  let passout_year = (req.body.passout_year=='' || req.body.passout_year==undefined)?'NULL':req.body.passout_year;
  let contact_number = req.body.contact_number==''?'NULL':req.body.contact_number;
  let email_id = req.body.email_id==''?'NULL':req.body.email_id;
  let linkdin_profile = req.body.linkdin_profile==''?'NULL':req.body.linkdin_profile;
  // console.log(date_of_birth, gender, year_of_admission, department, current_study_year, passout_year, contact_number, email_id, linkdin_profile);

  db.query("UPDATE Student SET date_of_birth=?, gender=?, year_of_admission=?, department=?, current_study_year=?, passout_year=?, contact_number=?, email_id=?, linkdin_profile=? WHERE PRN = ?", 
  [date_of_birth, gender, year_of_admission, department, current_study_year, passout_year, contact_number, email_id, linkdin_profile, id],
  (err, result) => {
    if(err) {
      console.log(err);
    } else {
      res.send(result);
    }
  }
  )
})


// Alumni updates details
app.put('/updateAlumniDetail', (req, res) => {
  const id = req.body.PRN;
  const name = req.body.name;
  let current_company = req.body.current_company==''?'NULL':req.body.current_company;
  let current_work = req.body.current_work==''?'NULL':req.body.current_work;
  let masters_institute_india = req.body.masters_institute_india==''?'NULL':req.body.masters_institute_india;
  let masters_university_abroad = req.body.masters_university_abroad==''?'NULL':req.body.masters_university_abroad;
  let department = req.body.department==''?'NULL':req.body.department;
  let passout_year = (req.body.passout_year=='' || req.body.passout_year==undefined)?'NULL':req.body.passout_year;
  let contact_number = req.body.contact_number==''?'NULL':req.body.contact_number;
  let email_id = req.body.email_id==''?'NULL':req.body.email_id;
  let linkdin_profile = req.body.linkdin_profile==''?'NULL':req.body.linkdin_profile;
  console.log(name, current_company, department, passout_year, contact_number, email_id, linkdin_profile);

  db.query("UPDATE Alumni SET name=?, current_work=?, masters_institute_india=?, masters_university_abroad=? current_company=?, passout_year=?, department=?, contact_number=?, email_id=?, linkdin_profile=? WHERE PRN = ?", 
  [name, current_work, masters_institute_india, masters_university_abroad, current_company, passout_year, department, contact_number, email_id, linkdin_profile, id],
  (err, result) => {
    if(err) {
      console.log(err);
    } else {
      res.send(result);
    }
  }
  )
})


// Coordinator updates details
app.put('/updateCoordinatorDetail', (req, res) => {
  const id = req.body.PRN;
  const name = req.body.name;
  let department = req.body.department==''?'NULL':req.body.department;
  let contact_number = req.body.contact_number==''?'NULL':req.body.contact_number;
  let email_id = req.body.email_id==''?'NULL':req.body.email_id;
  console.log(name, department, contact_number, email_id);

  db.query("UPDATE Coordinator SET name=?, department=?, contact_number=?, email_id=? WHERE username = ?", 
  [name, department, contact_number, email_id, id],
  (err, result) => {
    if(err) {
      console.log(err);
    } else {
      res.send(result);
    }
  }
  )
});

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'alumniportalkit@gmail.com',
    pass: 'Alumni@123'
  }
});


// Student asks Doubt
app.post("/askDoubt", (req, res) => {
  const recieverEmailId = req.body.recieverEmailId;
  const recieverName = req.body.recieverName;
  const senderEmailId = req.body.senderEmailId;
  const senderName = req.body.senderName;
  const subject = req.body.subject;
  const doubt = req.body.doubt;


  var mailOptions = {
    from: 'alumniportalkit@gmail.com',
    to: recieverEmailId,
    cc: senderEmailId,
    subject: 'Doubt regarding ' + subject,
    text: 'Hi ' + recieverName + ',\n\n' + 'Student named ' + senderName + ' has doubt.\n\n\n' + 'Doubt : ' + doubt + '\n\n\n You can reply to current email thread. \n\n\nNote: While replying please copy the email ID in cc and add it to cc of your reply. \n\n\nThank you for considering.\n\n\n Yours Sincerely, \nAlumni Portal of KIT'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.send("Mail Sent!");
    }
  });
  

});