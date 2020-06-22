import React, {useState} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
const INTERVAL = 1000000

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 400,
    flexGrow: 1,
  },
  img: {
    width: '100%',
    display: 'block',
    overflow: 'hidden',
    marginTop: 10
  },
  title: {
    margin: '10 0'
  },
  caption: {
  },
  steppers: {
    border: 'none !important'
  }
}));

function Stepper(props) {
  const styles = useStyles();
  const theme = useTheme();
  const {steps} = props;

  const [activeStep, setActiveStep] = useState(0);

  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const handleStepChange = step => {
    setActiveStep(step);
  };

  return (
    <div className={styles.root}>

      <Typography className={styles.title}>{steps[activeStep].title}</Typography>

      <Typography variant="caption" className={styles.caption}>{steps[activeStep].desc}</Typography>

      <AutoPlaySwipeableViews
        interval={INTERVAL}
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {steps.map((step, i) => (
          <div key={i}>
            {
              Math.abs(activeStep - i) <= 2 ? (
                <img className={styles.img} src={step.img} alt={step.title} />
              ) : null
            }
          </div>
        ))}
      </AutoPlaySwipeableViews>
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="text"
        activeStep={activeStep}
        className={styles.steppers}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
            Next
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            Back
          </Button>
        }
      />
    </div>
  );
}

export default Stepper;