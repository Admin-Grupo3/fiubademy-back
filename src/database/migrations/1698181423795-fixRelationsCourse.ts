import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRelationsCourse1698181423795 implements MigrationInterface {
    name = 'FixRelationsCourse1698181423795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "courses" DROP CONSTRAINT "FK_a4396a5235f159ab156a6f8b603"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP COLUMN "user_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD "description" character varying(255) DEFAULT ''
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD "rating_count" integer NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD "rating_star" integer NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD "price" double precision NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD "discount" double precision NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD "image" character varying(255) DEFAULT ''
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD "what_will_you_learn" character varying array NOT NULL DEFAULT '{}'
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD "content" character varying array NOT NULL DEFAULT '{}'
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD "creator_id" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD CONSTRAINT "FK_26e311556137a012ebab1fc9845" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`INSERT INTO categories 
        VALUES
        (3, 'Python', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        (4, 'Web Development', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        (5, 'Data Science', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        (6, 'AWS Certification', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        (7, 'Design', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        (8, 'Marketing', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        `);

        await queryRunner.query(`INSERT INTO courses(id, title, created_at, updated_at, language_id, description, rating_count, rating_star, price, discount, image)
        VALUES
        ('8582db4e-95db-43bc-99fa-6199a91183a8', 'Learn Python: The Complete Python Programming Course', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'Learn A-Z everything about Python; from the basics; to advanced topics like Python GUI; Python Data Analysis; and more!', 3059, 4.4, 84.99, 9.99, 'python_1'),
        ('f31fe7f6-6a09-4520-bc62-18bed4d96e9a', 'Learning Python for Data Analysis and Visualization', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'Learn python and how to use it to analyze; visualize and present data. Includes tons of sample code and hours of video!', 3059, 4.3, 84.99, 9.99, 'python_2'),
        ('2db08ce0-1249-4f18-9006-a23cd6efda16', 'Python for Beginners - Learn Programming from scratch', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'Python For Beginners : This course is meant for absolute beginners in programming or in python!', 1844, 4.3, 84.99, 9.99, 'python_3'),
        ('bf1712fe-f79d-40e9-ad1a-24c018333e5c', 'Python For Beginners : This course is meant for absolute beginners in programming or in python.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'Python introduction for beginners. Learn complete Python from scratch!', 2780, 4.3, 29.99, 9.99, 'python_4'),
        ('4cf9eb62-ed02-418a-b578-c088e697f140', 'Python Beyond the Basics - Object-Oriented Programming', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'From Classes To Inheritance - OOP In-Depth For Python Programmers', 2941, 4.2, 49.99, 10.99, 'python_5'),
        ('4cfd3812-05c9-457a-89bb-b58719c148c4', 'Become a Certified HTML CSS JavaScript Web Developer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'Complete coverage of HTML; CSS; Javascript while you Earn Four Respected Certifications', 2760, 4.1, 84.99, 9.99, 'web_dev_1'),
        ('591e9ac5-6999-4376-a90c-6fc832cc6774', 'The Complete 2020 Fullstack Web Developer Course', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'Learn HTML5; CSS3; JavaScript; Python; Wagtail CMS; PHP & MySQL from scratch!', 6200, 4.3, 72.99, 14.99, 'web_dev_2'),
        ('1c00106f-6ee7-40ea-9478-9ef3e1a70c43', 'Introduction to Web Development', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'Are you Interested in Learning Web Development? Enroll in this Free course for a Dynamic Introduction to the Profession!', 1740, 4, 19.99, 8.99, 'web_dev_3'),
        ('9937a08b-6d31-4f68-8ec4-adcda3e55f33', 'Running a Web Development Business: The Complete Guide', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'Learn how to start and grow a successful web development business. Get up & running and making sales in under a week.', 1577, 4.8, 70.99, 14.99, 'web_dev_4'),
        ('38f82aee-ab90-4495-b619-2bfc57d2110f', 'Ultimate Web Designer & Web Developer Course', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'Become a Full-Stack Web Designer in 2022 - Learn Everything from Web Design Fundamentals to Front-End Web Development', 2941, 4.6, 50.99, 11.99, 'web_dev_5'),
        ('81a63419-d209-481b-9f26-69383bd5b69f', 'Data Science A-Z™: Real-Life Data Science Exercises Included', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'Learn Data Science step by step through real Analytics examples. Data Mining; Modeling; Tableau Visualization and more!', 32103, 4.5, 77.99, 16.99, 'data_science_1'),
        ('f1dcc4ea-49c4-4ef9-a513-dfdae4209b0a', 'Machine Learning Data Science and Deep Learning with Python', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'Complete hands-on machine learning tutorial with data science; Tensorflow; artificial intelligence; and neural networks', 27687, 4.5, 87.99, 14.99, 'data_science_2'),
        ('80ec7b31-a265-4961-a3e3-68abdc006b35', 'Data Science: Deep Learning and Neural Networks in Python', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'The MOST in-depth look at neural network theory for machine learning; with both pure Python and Tensorflow code', 8513, 4.8, 90.99, 19.99, 'data_science_3'),
        ('1a537efe-8c0f-45db-b771-b0d82107594c', 'R Programming A-Z™: R For Data Science With Real Exercises!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'Learn Programming In R And R Studio. Data Analytics; Data Science; Statistical Analysis; Packages; Functions; GGPlot2', 47264, 4.8, 45.99, 6.99, 'data_science_4'),
        ('746b478f-44c0-458d-ad4a-55cd2767a839', 'Data Science and Machine Learning Bootcamp with R', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'Learn how to use the R programming language for data science and machine learning and data visualization!', 32103, 5, 77.99, 16.99, 'data_science_5'),
        ('bf73df88-9bfe-4d53-9554-69e3e58a76b7', 'Amazon Web Services (AWS) Certified 2022 - 4 Certifications!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'Videos; labs & practice exams - AWS Certified (Solutions Architect; Developer; SysOps Administrator; Cloud Practitioner)', 21046, 4.2, 69.99, 11.99, 'web_dev_1'),
        ('cdfdae4b-dea2-4d51-8c1a-76a44184a9eb', 'AWS Certified Security Specialty 2022', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'All you need to master AWS Certified Security Specialty certification.', 5387, 4.5, 34.99, 10.99, 'web_dev_2'),
        ('28270a5c-8f5d-4c04-b151-dfe2c79e1517', 'Part 1: AWS Certified Solutions Architect SAA C03 [Updated]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'AWS Associate Exam - Master Foundations. Join Live Study Group Q&A!', 1603, 4.5, 71.99, 15.99, 'web_dev_3'),
        ('b0289241-382e-4361-b473-abe9e2452a06', 'Photoshop Master Course: From Beginner to Photoshop Pro', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'This Adobe Photoshop Beginner Course will teach a Beginner Photoshop user all essentials of Adobe Photoshop CC', 5066, 4.9, 13.99, 5.99, 'design_1'),
        ('bdbeb16d-8f55-40d1-9bab-9bd4185df4bb', 'User Experience (UX): The Ultimate Guide to Usability and UX', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'Get a job in UX and build your user research and UX design skills with this hands-on user experience training course.', 6250, 4.4, 79.99, 16.99, 'design_2'),
        ('b2181ce8-bd2c-4386-bb82-e8dc152bbd9d', 'Copywriting - Become a Freelance Copywriter', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'Build a successful freelance copywriting business - turn basic writing skills into a paycheck.', 2779, 4.8, 88.99, 16.99, 'marketing_1'),
        ('6e75b31d-91d5-45c1-81a9-fddb68982bfe', 'How to Market Yourself as a Coach or Consultant', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'Learn a Proven; Step-by-Step Process You Can Use to Package; Brand; Market; & Sell Your Coaching or Consulting Services', 963, 3.8, 40.99, 10.99, 'marketing_2');
        `);

        await queryRunner.query(`INSERT INTO courses_categories_categories VALUES
        ('8582db4e-95db-43bc-99fa-6199a91183a8', 3),
        ('f31fe7f6-6a09-4520-bc62-18bed4d96e9a', 3),
        ('2db08ce0-1249-4f18-9006-a23cd6efda16', 3),
        ('bf1712fe-f79d-40e9-ad1a-24c018333e5c', 3),
        ('4cf9eb62-ed02-418a-b578-c088e697f140', 3),
        ('4cfd3812-05c9-457a-89bb-b58719c148c4', 4),
        ('591e9ac5-6999-4376-a90c-6fc832cc6774', 4),
        ('1c00106f-6ee7-40ea-9478-9ef3e1a70c43', 4),
        ('9937a08b-6d31-4f68-8ec4-adcda3e55f33', 4),
        ('38f82aee-ab90-4495-b619-2bfc57d2110f', 4),
        ('81a63419-d209-481b-9f26-69383bd5b69f', 5),
        ('f1dcc4ea-49c4-4ef9-a513-dfdae4209b0a', 5),
        ('80ec7b31-a265-4961-a3e3-68abdc006b35', 5),
        ('1a537efe-8c0f-45db-b771-b0d82107594c', 5),
        ('746b478f-44c0-458d-ad4a-55cd2767a839', 5),
        ('bf73df88-9bfe-4d53-9554-69e3e58a76b7', 4),
        ('cdfdae4b-dea2-4d51-8c1a-76a44184a9eb', 4),
        ('28270a5c-8f5d-4c04-b151-dfe2c79e1517', 4),
        ('b0289241-382e-4361-b473-abe9e2452a06', 7),
        ('bdbeb16d-8f55-40d1-9bab-9bd4185df4bb', 7),
        ('b2181ce8-bd2c-4386-bb82-e8dc152bbd9d', 8),
        ('6e75b31d-91d5-45c1-81a9-fddb68982bfe', 8);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "courses_categories_categories"
        `);

        await queryRunner.query(`
            DELETE FROM "categories" WHERE id >= 3
        `);

        await queryRunner.query(`
            DELETE FROM "courses"
        `);

        await queryRunner.query(`
            ALTER TABLE "courses" DROP CONSTRAINT "FK_26e311556137a012ebab1fc9845"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP COLUMN "creator_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP COLUMN "content"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP COLUMN "what_will_you_learn"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP COLUMN "image"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP COLUMN "discount"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP COLUMN "price"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP COLUMN "rating_star"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP COLUMN "rating_count"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP COLUMN "description"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD "user_id" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD CONSTRAINT "FK_a4396a5235f159ab156a6f8b603" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
