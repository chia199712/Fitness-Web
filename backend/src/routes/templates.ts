import { Router } from 'express';
import {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  addExerciseToTemplate,
  updateTemplateExercise,
  removeExerciseFromTemplate,
  applyTemplate,
  duplicateTemplate,
  toggleTemplateFavorite,
  getPopularTemplates,
  getTemplateStats,
  getMyTemplates,
  getFavoriteTemplates,
  getPublicTemplates,
  bulkTemplateOperation,
  getTemplateExerciseSuggestions
} from '../controllers/templateController';
import { authenticateToken } from '../middleware/auth';
import { validateCreateTemplate, validateUpdateTemplate, validateAddTemplateExercise, validateUpdateTemplateExercise } from '../middleware/validation';

const router = Router();

// 公開路由（不需要認證）
router.get('/public', getPublicTemplates);
router.get('/popular', getPopularTemplates);

// 需要認證的路由
router.use(authenticateToken);

// 範本 CRUD 路由
router.get('/', getTemplates);
router.get('/my', getMyTemplates);
router.get('/favorites', getFavoriteTemplates);
router.get('/stats', getTemplateStats);
router.get('/:id', getTemplateById);
router.post('/', validateCreateTemplate, createTemplate);
router.put('/:id', validateUpdateTemplate, updateTemplate);
router.delete('/:id', deleteTemplate);

// 範本動作管理路由
router.post('/:id/exercises', validateAddTemplateExercise, addExerciseToTemplate);
router.put('/:id/exercises/:exerciseId', validateUpdateTemplateExercise, updateTemplateExercise);
router.delete('/:id/exercises/:exerciseId', removeExerciseFromTemplate);

// 範本操作路由
router.post('/:id/apply', applyTemplate);
router.post('/:id/duplicate', duplicateTemplate);
router.post('/:id/favorite', toggleTemplateFavorite);

// 範本建議和輔助功能
router.get('/:id/suggestions', getTemplateExerciseSuggestions);

// 批量操作
router.post('/bulk', bulkTemplateOperation);

export default router;