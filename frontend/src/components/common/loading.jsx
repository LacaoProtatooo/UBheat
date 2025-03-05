import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const Loading = ({ loading }) => {
    return (
        <>
            {loading && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        zIndex: 10,
                    }}
                >
                    <CircularProgress size={60} />
                </Box>
            )}
        </>
    );
};

export default Loading;