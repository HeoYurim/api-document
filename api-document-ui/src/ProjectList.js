import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Box, Card, CardContent, CardActions, 
    Button, Grid, TextField, Dialog, DialogTitle, DialogContent, 
    DialogActions, IconButton, Snackbar, Alert 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { getProjects, createProject, deleteProject } from './api';

function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '', userId: 1 }); // userId 고정
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            showSnackbar('프로젝트 목록을 불러오지 못했습니다.', 'error');
        }
    };

    const handleCreate = async () => {
        if (!newProject.name) {
            showSnackbar('프로젝트 이름을 입력해주세요.', 'warning');
            return;
        }
        try {
            await createProject(newProject);
            showSnackbar('프로젝트가 생성되었습니다.', 'success');
            setOpenDialog(false);
            setNewProject({ name: '', description: '', userId: 1 });
            loadProjects();
        } catch (error) {
            console.error('Failed to create project:', error);
            showSnackbar('프로젝트 생성에 실패했습니다.', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
            try {
                await deleteProject(id);
                showSnackbar('프로젝트가 삭제되었습니다.', 'success');
                loadProjects();
            } catch (error) {
                console.error('Failed to delete project:', error);
                showSnackbar('프로젝트 삭제에 실패했습니다.', 'error');
            }
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const filteredProjects = projects.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    📋 프로젝트 목록
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
                    새 프로젝트
                </Button>
            </Box>

            <Box display="flex" alignItems="center" mb={3}>
                <Grid container spacing={1} alignItems="flex-end">
                    <Grid item>
                        <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                    </Grid>
                    <Grid item xs>
                        <TextField 
                            fullWidth 
                            label="프로젝트 검색 (이름, 설명)" 
                            variant="standard" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={3}>
                {filteredProjects.map((project) => (
                    <Grid item xs={12} sm={6} md={4} key={project.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" component="div">
                                    {project.name}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary" variant="body2">
                                    생성일: {project.createdAt}
                                </Typography>
                                <Typography variant="body2">
                                    {project.description || "설명 없음"}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Box flexGrow={1} />
                                <IconButton aria-label="delete" onClick={() => handleDelete(project.id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
                {filteredProjects.length === 0 && (
                    <Grid item xs={12}>
                        <Box textAlign="center" py={5}>
                            <Typography variant="body1" color="text.secondary">
                                프로젝트가 없습니다.
                            </Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>

            {/* 프로젝트 생성 모달 */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>새 프로젝트 생성</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="프로젝트 이름"
                        fullWidth
                        variant="outlined"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="설명"
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>취소</Button>
                    <Button onClick={handleCreate} variant="contained">생성</Button>
                </DialogActions>
            </Dialog>

            {/* 알림 메시지 (Snackbar) */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default ProjectList;
