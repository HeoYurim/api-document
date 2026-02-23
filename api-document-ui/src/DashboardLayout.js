import React, { useState, useEffect } from 'react';
import { 
    Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, 
    ListItem, ListItemButton, ListItemIcon, ListItemText, Container, 
    Grid, Paper, InputBase, Button, Avatar, Menu, MenuItem, CssBaseline, 
    Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, Snackbar, Alert, Chip 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import FilterListIcon from '@mui/icons-material/FilterList';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { getProjects, createProject, deleteProject } from './api';

// --- 테마 설정 (청록색 + 회색 조합) ---
const theme = createTheme({
    palette: {
        primary: {
            main: '#009688', // 청록색 (Teal)
        },
        secondary: {
            main: '#607d8b', // 회색 (Blue Grey)
        },
        background: {
            default: '#f4f6f8', // 밝은 회색 배경
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Pretendard", "Roboto", "Helvetica", "Arial", sans-serif',
        h6: {
            fontWeight: 700,
        },
    },
    shape: {
        borderRadius: 12, // 둥글게
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // 대문자 자동 변환 끄기
                },
            },
        },
    },
});

const drawerWidth = 260;

function DashboardLayout() {
    const [openDrawer, setOpenDrawer] = useState(true);
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '', userId: 1 });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [anchorElUser, setAnchorElUser] = useState(null);

    const toggleDrawer = () => {
        setOpenDrawer(!openDrawer);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // --- API 연동 부분 (기존 로직 유지) ---
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
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                
                {/* 상단 헤더 (AppBar) */}
                <AppBar position="absolute" open={openDrawer} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar sx={{ pr: '24px' }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{ marginRight: '36px', ...(openDrawer && { display: 'none' }) }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                            API Document Manager
                        </Typography>
                        <IconButton color="inherit">
                            <NotificationsIcon />
                        </IconButton>
                        <IconButton color="inherit" onClick={handleOpenUserMenu} sx={{ ml: 1 }}>
                            <Avatar sx={{ bgcolor: 'secondary.main' }}>H</Avatar>
                        </IconButton>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={handleCloseUserMenu}><Typography textAlign="center">프로필</Typography></MenuItem>
                            <MenuItem onClick={handleCloseUserMenu}><Typography textAlign="center">로그아웃</Typography></MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>

                {/* 왼쪽 사이드바 (Drawer) */}
                <Drawer
                    variant="permanent"
                    open={openDrawer}
                    sx={{
                        '& .MuiDrawer-paper': {
                            position: 'relative',
                            whiteSpace: 'nowrap',
                            width: drawerWidth,
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                            boxSizing: 'border-box',
                            ...(!openDrawer && {
                                overflowX: 'hidden',
                                transition: theme.transitions.create('width', {
                                    easing: theme.transitions.easing.sharp,
                                    duration: theme.transitions.duration.leavingScreen,
                                }),
                                width: theme.spacing(7),
                                [theme.breakpoints.up('sm')]: {
                                    width: theme.spacing(9),
                                },
                            }),
                        },
                    }}
                >
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <ListItemButton selected>
                            <ListItemIcon>
                                <DashboardIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="프로젝트 목록" />
                        </ListItemButton>
                        <ListItemButton>
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary="사용자 관리" />
                        </ListItemButton>
                        <ListItemButton>
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="설정" />
                        </ListItemButton>
                    </List>
                </Drawer>

                {/* 메인 콘텐츠 영역 */}
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        
                        {/* 검색 및 필터 영역 */}
                        <Paper
                            component="form"
                            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mb: 3, borderRadius: 2 }}
                            elevation={0}
                        >
                            <IconButton sx={{ p: '10px' }} aria-label="menu">
                                <SearchIcon />
                            </IconButton>
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="프로젝트 검색 (이름, 설명)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                            <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
                                <FilterListIcon />
                            </IconButton>
                        </Paper>

                        {/* 상단 액션 버튼 */}
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h5" component="h2" fontWeight="bold" color="text.secondary">
                                전체 프로젝트 ({filteredProjects.length})
                            </Typography>
                            <Button 
                                variant="contained" 
                                startIcon={<AddIcon />} 
                                onClick={() => setOpenDialog(true)}
                                sx={{ borderRadius: 2, px: 3, py: 1, boxShadow: 2 }}
                            >
                                프로젝트 생성
                            </Button>
                        </Box>

                        {/* 프로젝트 카드 그리드 */}
                        <Grid container spacing={3}>
                            {filteredProjects.map((project) => (
                                <Grid item xs={12} sm={6} md={4} key={project.id}>
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                                <Typography variant="h6" component="div" fontWeight="bold" noWrap>
                                                    {project.name}
                                                </Typography>
                                                <Chip label="Active" size="small" color="success" variant="outlined" />
                                            </Box>
                                            <Typography sx={{ mb: 2, fontSize: '0.875rem' }} color="text.secondary">
                                                {project.createdAt.split(' ')[0]} 생성
                                            </Typography>
                                            <Typography variant="body2" color="text.primary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                                {project.description || "설명 없음"}
                                            </Typography>
                                        </CardContent>
                                        <Divider />
                                        <CardActions sx={{ justifyContent: 'flex-end', px: 2, py: 1.5 }}>
                                            <Button size="small" color="primary">자세히</Button>
                                            <IconButton size="small" onClick={() => handleDelete(project.id)} color="error">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                            {filteredProjects.length === 0 && (
                                <Grid item xs={12}>
                                    <Box textAlign="center" py={10}>
                                        <Typography variant="h6" color="text.secondary">
                                            조건에 맞는 프로젝트가 없습니다.
                                        </Typography>
                                        <Typography variant="body2" color="text.disabled" mt={1}>
                                            새로운 프로젝트를 생성해보세요!
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </Container>
                </Box>

                {/* 프로젝트 생성 모달 */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
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
                            sx={{ mb: 2, mt: 1 }}
                        />
                        <TextField
                            margin="dense"
                            label="설명"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setOpenDialog(false)} color="inherit">취소</Button>
                        <Button onClick={handleCreate} variant="contained" disableElevation>생성하기</Button>
                    </DialogActions>
                </Dialog>

                {/* 알림 메시지 (Snackbar) */}
                <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
}

export default DashboardLayout;
