import { Box, Grid } from '@mui/material';
import LocationComboBox from '../LocationComboBox/LocationComboBox';
import TripDatePicker from '../TripDatePicker/TripDatePicker';
import SearchBarButton from './SearchBarButton';
import VehicleTypeDropdown from './VehicleTypeDropdown';

function ResultsGallerySearchBar() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        width: '90%',
        margin: 3,
      }}
    >
      <Grid item xs={6}>
        <LocationComboBox />
      </Grid>
      <Grid item xs={4}>
        <TripDatePicker />
      </Grid>
      <Grid item xs={4}>
        <VehicleTypeDropdown />
      </Grid>
      <Grid item xs={4}>
        <SearchBarButton />
      </Grid>
    </Box>
  );
}

export default ResultsGallerySearchBar;
