import { Box, Grid } from "@mui/material";
import LocationComboBox from "../LocationComboBox/LocationComboBox";
import TripDatePicker from "../TripDatePicker/TripDatePicker";
import SearchBarButton from "./SearchBarButton";
import VehicleTypeDropdown from "./VehicleTypeDropdown";

function ResultsGallerySearchBar() {
  return (
    <Box
      sx={{
        display: "flex",
        flexGrow: 1,
        width: "70%",
        margin: 3,
        
      }}
    >
      <Grid container spacing={0}>
        <Grid item xs={4} md={5}>
          <LocationComboBox />
        </Grid>
        <Grid item xs={3} md={3}>
          <TripDatePicker />
        </Grid>
        <Grid item xs={3} md={2}>
          <VehicleTypeDropdown />
        </Grid>
        <Grid item xs={2} md={2}>
          <SearchBarButton />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ResultsGallerySearchBar;
