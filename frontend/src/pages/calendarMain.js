import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import DatePicker from "react-datepicker"
import "react-big-calendar/lib/css/react-big-calendar.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './calendarMain.css';
import 'react-datepicker/dist/react-datepicker.css';

const localizer = momentLocalizer(moment);

function CalendarMain() {
    // set events for calendar events handling
    const [events, setEvents] = useState([]);

    // show and hide modal
    const [showTaskModal, setShowModal] = useState(false);
    const handleShow = () => {
        setShowModal(true)
        setIsEditMode(false)
    };
    const handleClose = () => {
        setShowModal(false);
        clearTaskFormInputs();
    };

    // handle input fields for TASK management
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [description, setDescription] = useState('');
    const [allDay, setAllDay] = useState(false);
    const [eventId, setEventId] = useState('');

    // set event for edit and create modal buttons
    const [isEditMode, setIsEditMode] = useState(false);
    
    const saveTaskOnDB = (e) => {
        var obj = {
            "title": title,
            "description": description,
            "startTime": start,
            "endTime": end,
            "allDay": allDay,
            type: 'task'
        }
        console.log(obj)

        if(title != "" && description != "" && start != "" && end != "") {
          axios.post('http://localhost:5000/users/postTaskToMD', obj).then((response) => {
              fetchAllEventsFromDB();
              setShowModal(false);
          }).catch(err => {
              console.log(err);
          })
        } else {
          var ele = document.getElementById('taskUploadModalErrorText');
          ele.innerHTML = "Fill the mandatory fields for create";
          ele.style.display = 'block';
          setTimeout(() => {
            ele.style.display = 'none';
          }, 3000);
        }
    }

    const clearTaskFormInputs = () => {
        setTitle('');
        setStart('');
        setEnd('');
        setDescription('');
        setAllDay(false);
    }

    useEffect(() => {
        fetchAllEventsFromDB()
    }, []);

    const handleSelectSlot = ({ start, end }) => {
        // const title = window.prompt('New Event name');
        // if (title) {
        //     const newEvent = { title, start, end };
        //     axios.post('http://localhost:5000/users/postTaskToMD', newEvent).then(response => {
        //         console.log(response)
        //         setEvents([...events, response.data]);
        //     }).catch(error => {
        //         console.error('There was an error creating the event!', error);
        //     });
        // }
    };

    const handleEventClick = (event) => {
      setTitle(event.title);
      setStart(event.start);
      setEnd(event.end);
      setDescription(event.description);
      setAllDay(event.allDay);
      setEventId(event.id)
      // enable edit and delete button on modal
      setIsEditMode(true)
      // open model after data patch to input
      setShowModal(true)
    };

    const fetchAllEventsFromDB = () => {
        // Fetch events from the server
        axios.get("http://localhost:5000/users/getTaskListFromDB").then((response) => {
            const events = response.data.map((task) => ({
            title: task.title,
            start: new Date(task.startTime),
            end: new Date(task.endTime),
            allDay: task.allDay,
            id: task._id,
            description: task.description
            }));
            setEvents(events);
        }).catch((error) => {
            console.error("There was an error fetching the events!", error);
        });
    }

    const DeleteSelectedTaskOnModel = () => {
        axios.delete(`http://localhost:5000/users/deleteTaskFromDB?id=${eventId}`).then((response) => {
            fetchAllEventsFromDB()
            setShowModal(false);
        }).catch(err => {
            console.log(err);
        })
    }
    
    const EditSelectedTaskOnModel = () => {
        var obj = {
            id : eventId,
            data : {
                "title": title,
                "description": description,
                "startTime": start,
                "endTime": end,
                "allDay": allDay,
                type: 'task'
            }
        }
        if(title != "" && description != "" && start != "" && end != "") {
          axios.put('http://localhost:5000/users/updateTaskOnDB', obj).then((response) => {
              fetchAllEventsFromDB();
              setShowModal(false)
          }).catch(err => {
              console.log(err);
          })
        } else {
          var ele = document.getElementById('taskUploadModalErrorText');
          ele.innerHTML = "Fill the mandatory fields for update";
          ele.style.display = 'block';
          setTimeout(() => {
            ele.style.display = 'none';
          }, 3000);
        }
    }

    return (
      <div className="container calendarContainerMain">
        <div className="calendarHeadSectionMain">
          <h1>Calendar Application</h1>
          <button className="btn btn-primary" onClick={handleShow}> Create Task </button>
        </div>

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleEventClick}
          style={{ height: 500 }}
        />

        {showTaskModal && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Daily Task Sheduler</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleClose}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <form  className="row modalFormForTask">
                    <label className="col-4 p-0 mt-1">Title *</label>
                    <input placeholder="Title"
                      className="col-8 mb-4 titleModalInputBox"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <br />

                    <label className="col-4 p-0 mt-1">Start time *</label>
                    <DatePicker
                      className="col-8 mb-4 startDateModalInputBox"
                      placeholderText="Start Date & time"
                        selected={start}
                      onChange={(e) => setStart(e)}
                      showTimeSelect
                      dateFormat="yyyy/MM/dd HH:mm"
                    />
                    <br />

                    <label className="col-4 p-0 mt-1">End time *</label>
                    <DatePicker
                      className="col-8 mb-4 endTimeModalInputBox"
                      placeholderText="End Date & time"
                      selected={end}
                      onChange={(e) => setEnd(e)}
                      showTimeSelect
                      dateFormat="yyyy/MM/dd HH:mm"
                    /> 
                    <br />

                    <label className="col-4 p-0 mt-1">All Day</label>
                    <input
                      className="col-8 mb-4 allDayModalCheckBox"
                      type="checkbox"
                      checked={allDay}
                      onChange={(e) => setAllDay(e.target.checked)}
                    />

                    <br />

                    <label className="col-12 p-0 mb-2">description *</label>
                    <br />
                    <textarea
                    className="col-12 descriptionModalInputBox"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
                    <div id="taskUploadModalErrorText"></div>
                  </form>
                </div>
                <div className="modal-footer">
                  {isEditMode ? (
                    <>
                      <button className="btn btn-primary" onClick={EditSelectedTaskOnModel}> Edit Task </button>
                      <button className="btn btn-primary" onClick={DeleteSelectedTaskOnModel}> Delete Task </button>
                    </>
                    ) : (
                    <>
                    <button className="btn btn-secondary" onClick={handleClose}> Exit </button>
                    <button className="btn btn-primary" onClick={saveTaskOnDB}> Create Task </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}

export default CalendarMain;