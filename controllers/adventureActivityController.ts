import { Request, Response } from 'express';
import AdventureActivity, { IAdventureActivity } from '../models/AdventureActivity';
import { uploadToCloudinary } from '../utils/cloudinary';
// import { clearCache } from '../utils/cache';

// Get all adventure activities with filtering and pagination
export const getAdventureActivities = async (req: Request, res: Response) => {
  try {
    const {
      active,
      category,
      difficulty,
      ageGroup,
      timing,
      page = 1,
      limit = 10,
      sortBy = 'order',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter: any = {};
    
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    
    if (ageGroup) {
      filter.ageGroup = ageGroup;
    }
    
    if (timing) {
      filter.timing = timing;
    }

    // Calculate pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const [activities, totalCount] = await Promise.all([
      AdventureActivity.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      AdventureActivity.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: activities,
      count: activities.length,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Error fetching adventure activities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch adventure activities',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get single adventure activity by ID
export const getAdventureActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const activity = await AdventureActivity.findById(id);
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Adventure activity not found'
      });
    }

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Error fetching adventure activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch adventure activity',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create new adventure activity
export const createAdventureActivity = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      detailedDescription,
      category,
      ageGroup,
      difficulty,
      timing,
      duration,
      capacity,
      highlights,
      rating,
      icon,
      order,
      isActive,
      equipment,
      safetyRequirements,
      weatherDependent,
      minAge,
      maxAge,
      price,
      location,
      instructorRequired,
      groupSize
    } = req.body;

    // Handle image upload
    let imageData = null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'adventure-activities');
      imageData = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id
      };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Image is required'
      });
    }

    // Parse highlights array if it's a string
    let highlightsArray = highlights;
    if (typeof highlights === 'string') {
      try {
        highlightsArray = JSON.parse(highlights);
      } catch {
        highlightsArray = highlights.split(',').map((h: string) => h.trim());
      }
    }

    // Parse equipment array if provided
    let equipmentArray = equipment;
    if (equipment && typeof equipment === 'string') {
      try {
        equipmentArray = JSON.parse(equipment);
      } catch {
        equipmentArray = equipment.split(',').map((e: string) => e.trim());
      }
    }

    // Parse safety requirements array if provided
    let safetyArray = safetyRequirements;
    if (safetyRequirements && typeof safetyRequirements === 'string') {
      try {
        safetyArray = JSON.parse(safetyRequirements);
      } catch {
        safetyArray = safetyRequirements.split(',').map((s: string) => s.trim());
      }
    }

    // Parse price object if provided
    let priceObj = price;
    if (price && typeof price === 'string') {
      try {
        priceObj = JSON.parse(price);
      } catch {
        // Handle comma-separated values
        const priceParts = price.split(',');
        priceObj = {
          adult: parseFloat(priceParts[0]) || 0,
          child: parseFloat(priceParts[1]) || 0,
          group: priceParts[2] ? parseFloat(priceParts[2]) : undefined
        };
      }
    }

    // Parse group size object if provided
    let groupSizeObj = groupSize;
    if (groupSize && typeof groupSize === 'string') {
      try {
        groupSizeObj = JSON.parse(groupSize);
      } catch {
        // Handle comma-separated values
        const sizeParts = groupSize.split(',');
        groupSizeObj = {
          min: parseInt(sizeParts[0]) || 1,
          max: parseInt(sizeParts[1]) || 10
        };
      }
    }

    const activityData: Partial<IAdventureActivity> = {
      name,
      description,
      detailedDescription,
      category,
      image: imageData,
      icon,
      ageGroup,
      difficulty,
      timing,
      duration,
      capacity,
      highlights: highlightsArray,
      rating: rating ? parseFloat(rating) : undefined,
      order: order ? parseInt(order) : 0,
      isActive: isActive !== 'false',
      equipment: equipmentArray,
      safetyRequirements: safetyArray,
      weatherDependent: weatherDependent === 'true',
      minAge: minAge ? parseInt(minAge) : undefined,
      maxAge: maxAge ? parseInt(maxAge) : undefined,
      price: priceObj,
      location,
      instructorRequired: instructorRequired === 'true',
      groupSize: groupSizeObj
    };

    const activity = new AdventureActivity(activityData);
    await activity.save();

    // Clear cache
    // await clearCache('adventure-activities');

    res.status(201).json({
      success: true,
      data: activity,
      message: 'Adventure activity created successfully'
    });
  } catch (error) {
    console.error('Error creating adventure activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create adventure activity',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update adventure activity
export const updateAdventureActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: any = {};

    // Handle image upload if provided
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'adventure-activities');
      updateData.image = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id
      };
    }

    // Handle other fields
    const allowedFields = [
      'name', 'description', 'detailedDescription', 'category', 'ageGroup',
      'difficulty', 'timing', 'duration', 'capacity', 'highlights', 'rating',
      'icon', 'order', 'isActive', 'equipment', 'safetyRequirements',
      'weatherDependent', 'minAge', 'maxAge', 'price', 'location',
      'instructorRequired', 'groupSize'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'highlights' || field === 'equipment' || field === 'safetyRequirements') {
          // Handle array fields
          let arrayData = req.body[field];
          if (typeof arrayData === 'string') {
            try {
              arrayData = JSON.parse(arrayData);
            } catch {
              arrayData = arrayData.split(',').map((item: string) => item.trim());
            }
          }
          updateData[field] = arrayData;
        } else if (field === 'price' || field === 'groupSize') {
          // Handle object fields
          let objData = req.body[field];
          if (typeof objData === 'string') {
            try {
              objData = JSON.parse(objData);
            } catch {
              // Handle comma-separated values for price
              if (field === 'price') {
                const priceParts = objData.split(',');
                objData = {
                  adult: parseFloat(priceParts[0]) || 0,
                  child: parseFloat(priceParts[1]) || 0,
                  group: priceParts[2] ? parseFloat(priceParts[2]) : undefined
                };
              } else if (field === 'groupSize') {
                const sizeParts = objData.split(',');
                objData = {
                  min: parseInt(sizeParts[0]) || 1,
                  max: parseInt(sizeParts[1]) || 10
                };
              }
            }
          }
          updateData[field] = objData;
        } else if (field === 'rating' || field === 'order' || field === 'minAge' || field === 'maxAge') {
          updateData[field] = parseFloat(req.body[field]);
        } else if (field === 'isActive' || field === 'weatherDependent' || field === 'instructorRequired') {
          updateData[field] = req.body[field] === 'true';
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    const activity = await AdventureActivity.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Adventure activity not found'
      });
    }

    // Clear cache
    // await clearCache('adventure-activities');

    res.json({
      success: true,
      data: activity,
      message: 'Adventure activity updated successfully'
    });
  } catch (error) {
    console.error('Error updating adventure activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update adventure activity',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete adventure activity
export const deleteAdventureActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const activity = await AdventureActivity.findByIdAndDelete(id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Adventure activity not found'
      });
    }

    // Clear cache
    // await clearCache('adventure-activities');

    res.json({
      success: true,
      message: 'Adventure activity deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting adventure activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete adventure activity',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Toggle adventure activity status
export const toggleAdventureActivityStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const activity = await AdventureActivity.findById(id);
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Adventure activity not found'
      });
    }

    activity.isActive = !activity.isActive;
    await activity.save();

    // Clear cache
    // await clearCache('adventure-activities');

    res.json({
      success: true,
      data: activity,
      message: `Adventure activity ${activity.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling adventure activity status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle adventure activity status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Reorder adventure activities
export const reorderAdventureActivities = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items must be an array'
      });
    }

    // Update order for each item
    const updatePromises = items.map((item: { id: string; order: number }) =>
      AdventureActivity.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updatePromises);

    // Clear cache
    // await clearCache('adventure-activities');

    // Fetch updated activities
    const activities = await AdventureActivity.find({ isActive: true })
      .sort({ order: 1 })
      .lean();

    res.json({
      success: true,
      data: activities,
      message: 'Adventure activities reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering adventure activities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder adventure activities',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get adventure activity statistics
export const getAdventureActivityStats = async (req: Request, res: Response) => {
  try {
    const [
      totalActivities,
      activeActivities,
      inactiveActivities,
      categoryStats,
      difficultyStats,
      ageGroupStats
    ] = await Promise.all([
      AdventureActivity.countDocuments(),
      AdventureActivity.countDocuments({ isActive: true }),
      AdventureActivity.countDocuments({ isActive: false }),
      AdventureActivity.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]),
      AdventureActivity.aggregate([
        { $group: { _id: '$difficulty', count: { $sum: 1 } } }
      ]),
      AdventureActivity.aggregate([
        { $group: { _id: '$ageGroup', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        total: totalActivities,
        active: activeActivities,
        inactive: inactiveActivities,
        byCategory: categoryStats,
        byDifficulty: difficultyStats,
        byAgeGroup: ageGroupStats
      }
    });
  } catch (error) {
    console.error('Error fetching adventure activity stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch adventure activity statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
