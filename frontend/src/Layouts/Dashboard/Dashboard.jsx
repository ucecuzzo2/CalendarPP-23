import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Calendar from "./Components/Calendar/Calendar";
import { useAuth } from "../../Auth/Auth";
import DashboardHeader from "./Components/Header/DashboardHeader";
import SchoolContext from "./Context/SchoolContext";
import EventsContext from "./Context/EventsContext";
import { JoyrideProvider } from "./Context/Joyride/JoyrideProvider";

const Dashboard = ({ firstLogin }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [schools, setSchools] = useState([]);
  const { token } = useAuth();
  const handleNext = () => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    let nextMonth = currentMonth + 1;
    let nextYear = currentYear;

    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }

    const nextMonthDate = new Date(nextYear, nextMonth, 1);
    setCurrentDate(nextMonthDate);
  };

  const handlePrev = () => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    let previousMonth = currentMonth - 1;
    let previousYear = currentYear;

    if (previousMonth < 0) {
      previousMonth = 11;
      previousYear -= 1;
    }

    const previousMonthDate = new Date(previousYear, previousMonth, 1);
    setCurrentDate(previousMonthDate);
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/events", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => console.log(error));

    fetch("http://localhost:8080/api/users/me/schools", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setSchools(data);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const onScroll = (event) => {
    event.deltaY > 0 ? handleNext() : handlePrev();
  };

  useEffect(() => {
    window.addEventListener("wheel", onScroll);
    return () => {
      window.removeEventListener("wheel", onScroll);
    };
  }, [currentDate]);

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 1px)",
      }}
    >
      <SchoolContext.Provider value={{ schools, setSchools }}>
        <EventsContext.Provider value={{ events, setEvents }}>
          <JoyrideProvider showTutorial={firstLogin}>
            <DashboardHeader
              handlePrev={handlePrev}
              handleNext={handleNext}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              schools={schools}
            />

            <Calendar
              currentDate={currentDate}
              events={events}
              setEvents={setEvents}
              schools={schools}
            />
          </JoyrideProvider>
        </EventsContext.Provider>
      </SchoolContext.Provider>
    </Box>
  );
};

export default Dashboard;
