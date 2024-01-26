import { Accordion, AccordionDetails, AccordionSummary, Grid } from "@mui/material";
import { ExpandMoreRounded } from "@mui/icons-material";
import { db, auth } from "@/firebase/config";
import { useState, useEffect } from "react";

export default function LessonList(props) {
  const [lessons, setLessons] = useState([]);

  const { ariaControls, id, headerText, lessonType, locale } = props;

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const snapshot = await db
          .collection(`users/${userId}/${lessonType}/${locale}/lessons`)
          .get();

        const lessonData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
						id: data.id || 0,
						name: data.name || "",
            progress: data.progress || 0,
						isUnlocked: data.isUnlocked || false,
          };
        });

        setLessons(lessonData);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    const userId = auth.currentUser.uid;

    fetchLessons();
  }, [locale]);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreRounded />}
        aria-controls={ariaControls}
        id={id}
      >
        {headerText}
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2} justifyContent="center">
          {lessons.map((lesson) => (
            <Grid item>
							<div className={`rounded-md ${lesson.isUnlocked ? 'bg-gradient-to-r from-slate-600 to-slate-500' : 'bg-gray-400'} shadow-xl flex flex-col justify-start w-48 h-48 p-5`}>
								<h1 className="text-3xl text-slate-50">{lesson.name}</h1>
								<p className="text-md text-slate-50">
									{lesson.isUnlocked ? `${lesson.progress === 0 ? 0 : lesson.progress.toPrecision(3)}%` : "Not unlocked"}
								</p>
							</div>

            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}