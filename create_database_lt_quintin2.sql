-- SQL Script to create Container Tracking System database for LT-QUINTIN2 server

-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ContainerTrackingSystem')
BEGIN
    CREATE DATABASE [ContainerTrackingSystem]
END
GO

USE [ContainerTrackingSystem]
GO

-- Create Tables
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DropdownOptions]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[DropdownOptions](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [Category] [nvarchar](50) NOT NULL,
        [Value] [nvarchar](100) NOT NULL,
        [IsActive] [bit] NOT NULL,
        [SortOrder] [int] NOT NULL,
        CONSTRAINT [PK_DropdownOptions] PRIMARY KEY CLUSTERED ([Id] ASC)
    )
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Fpms]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Fpms](
        [FpmID] [int] IDENTITY(1,1) NOT NULL,
        [FpmName] [nvarchar](100) NOT NULL,
        [Active] [bit] NOT NULL,
        CONSTRAINT [PK_Fpms] PRIMARY KEY CLUSTERED ([FpmID] ASC)
    )
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Ports]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Ports](
        [PortID] [int] IDENTITY(1,1) NOT NULL,
        [PortOfEntry] [nvarchar](100) NOT NULL,
        CONSTRAINT [PK_Ports] PRIMARY KEY CLUSTERED ([PortID] ASC)
    )
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Shiplines]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Shiplines](
        [ShiplineID] [int] IDENTITY(1,1) NOT NULL,
        [ShiplineName] [nvarchar](100) NOT NULL,
        [Link] [nvarchar](255) NULL,
        [IsDynamicLink] [bit] NOT NULL,
        CONSTRAINT [PK_Shiplines] PRIMARY KEY CLUSTERED ([ShiplineID] ASC)
    )
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Terminals]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Terminals](
        [TerminalID] [int] IDENTITY(1,1) NOT NULL,
        [TerminalName] [nvarchar](100) NOT NULL,
        [PortID] [int] NOT NULL,
        [Link] [nvarchar](255) NULL,
        CONSTRAINT [PK_Terminals] PRIMARY KEY CLUSTERED ([TerminalID] ASC),
        CONSTRAINT [FK_Terminals_Ports] FOREIGN KEY([PortID]) REFERENCES [dbo].[Ports] ([PortID])
    )
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[VesselLines]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[VesselLines](
        [VesselLineID] [int] IDENTITY(1,1) NOT NULL,
        [VesselLineName] [nvarchar](100) NOT NULL,
        [Link] [nvarchar](255) NULL,
        [IsDynamicLink] [bit] NOT NULL,
        CONSTRAINT [PK_VesselLines] PRIMARY KEY CLUSTERED ([VesselLineID] ASC)
    )
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Vessels]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Vessels](
        [VesselID] [int] IDENTITY(1,1) NOT NULL,
        [VesselName] [nvarchar](100) NOT NULL,
        [VesselLineID] [int] NOT NULL,
        [IMO] [nvarchar](50) NULL,
        [MMSI] [nvarchar](50) NULL,
        CONSTRAINT [PK_Vessels] PRIMARY KEY CLUSTERED ([VesselID] ASC),
        CONSTRAINT [FK_Vessels_VesselLines] FOREIGN KEY([VesselLineID]) REFERENCES [dbo].[VesselLines] ([VesselLineID])
    )
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Containers]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Containers](
        [ContainerID] [int] IDENTITY(1,1) NOT NULL,
        [ContainerNumber] [nvarchar](20) NOT NULL,
        [ProjectNumber] [nvarchar](50) NULL,
        [CurrentStatus] [nvarchar](50) NULL,
        [ShiplineID] [int] NULL,
        [ContainerSize] [nvarchar](50) NULL,
        [MainSource] [nvarchar](100) NULL,
        [Transload] [bit] NOT NULL,
        [BOLBookingNumber] [nvarchar](100) NULL,
        [VendorIDNumber] [nvarchar](100) NULL,
        [Vendor] [nvarchar](100) NULL,
        [PONumber] [nvarchar](100) NULL,
        [VesselLineID] [int] NULL,
        [VesselID] [int] NULL,
        [Voyage] [nvarchar](50) NULL,
        [PortOfDeparture] [nvarchar](100) NULL,
        [PortID] [int] NULL,
        [PortOfEntry] [nvarchar](100) NULL,
        [TerminalID] [int] NULL,
        [Rail] [bit] NOT NULL,
        [RailDestination] [nvarchar](100) NULL,
        [RailwayLine] [nvarchar](100) NULL,
        [RailPickupNumber] [nvarchar](100) NULL,
        [CarrierID] [int] NULL,
        [Carrier] [nvarchar](100) NULL,
        [Sail] [datetime2](7) NULL,
        [SailActual] [nvarchar](20) NULL,
        [Berth] [datetime2](7) NULL,
        [BerthActual] [nvarchar](20) NULL,
        [Arrival] [datetime2](7) NULL,
        [ArrivalActual] [nvarchar](20) NULL,
        [Offload] [datetime2](7) NULL,
        [OffloadActual] [nvarchar](20) NULL,
        [Available] [datetime2](7) NULL,
        [PickupLFD] [datetime2](7) NULL,
        [PortRailwayPickup] [datetime2](7) NULL,
        [ReturnLFD] [datetime2](7) NULL,
        [LoadToRail] [datetime2](7) NULL,
        [RailDeparture] [datetime2](7) NULL,
        [RailETA] [datetime2](7) NULL,
        [Delivered] [datetime2](7) NULL,
        [Returned] [datetime2](7) NULL,
        [LastUpdated] [datetime2](7) NOT NULL DEFAULT GETDATE(),
        [Notes] [nvarchar](max) NULL,
        CONSTRAINT [PK_Containers] PRIMARY KEY CLUSTERED ([ContainerID] ASC),
        CONSTRAINT [FK_Containers_Shiplines] FOREIGN KEY([ShiplineID]) REFERENCES [dbo].[Shiplines] ([ShiplineID]),
        CONSTRAINT [FK_Containers_VesselLines] FOREIGN KEY([VesselLineID]) REFERENCES [dbo].[VesselLines] ([VesselLineID]),
        CONSTRAINT [FK_Containers_Vessels] FOREIGN KEY([VesselID]) REFERENCES [dbo].[Vessels] ([VesselID]),
        CONSTRAINT [FK_Containers_Ports] FOREIGN KEY([PortID]) REFERENCES [dbo].[Ports] ([PortID]),
        CONSTRAINT [FK_Containers_Terminals] FOREIGN KEY([TerminalID]) REFERENCES [dbo].[Terminals] ([TerminalID])
    )
END
GO

-- Seed initial data
IF NOT EXISTS (SELECT * FROM [dbo].[DropdownOptions] WHERE [Category] = 'ContainerStatus')
BEGIN
    INSERT INTO [dbo].[DropdownOptions] ([Category], [Value], [IsActive], [SortOrder])
    VALUES
        ('ContainerStatus', 'Not Sailed', 1, 1),
        ('ContainerStatus', 'On Vessel', 1, 2),
        ('ContainerStatus', 'At Port', 1, 3),
        ('ContainerStatus', 'On Rail', 1, 4),
        ('ContainerStatus', 'Delivered', 1, 5),
        ('ContainerStatus', 'Returned', 1, 6),
        ('ContainerSize', '20''', 1, 1),
        ('ContainerSize', '40''', 1, 2),
        ('ContainerSize', '40'' HC', 1, 3),
        ('ContainerSize', '45''', 1, 4),
        ('ActualEstimate', 'Actual', 1, 1),
        ('ActualEstimate', 'Estimate', 1, 2)
END
GO

-- Sample Ports
IF NOT EXISTS (SELECT * FROM [dbo].[Ports])
BEGIN
    INSERT INTO [dbo].[Ports] ([PortOfEntry])
    VALUES
        ('Los Angeles'),
        ('Long Beach'),
        ('New York/New Jersey'),
        ('Savannah'),
        ('Seattle')
END
GO

-- Sample Shiplines
IF NOT EXISTS (SELECT * FROM [dbo].[Shiplines])
BEGIN
    INSERT INTO [dbo].[Shiplines] ([ShiplineName], [Link], [IsDynamicLink])
    VALUES
        ('Maersk', 'https://www.maersk.com/tracking/{0}', 1),
        ('MSC', 'https://www.msc.com/track-a-shipment?query={0}', 1),
        ('CMA CGM', 'https://www.cma-cgm.com/ebusiness/tracking/search?SearchBy=Container&Reference={0}', 1),
        ('COSCO', 'https://elines.coscoshipping.com/ebusiness/cargoTracking?trackingType=CONTAINER&number={0}', 1),
        ('Hapag-Lloyd', 'https://www.hapag-lloyd.com/en/online-business/tracing/tracing-by-container.html?container={0}', 1)
END
GO

-- Sample VesselLines
IF NOT EXISTS (SELECT * FROM [dbo].[VesselLines])
BEGIN
    INSERT INTO [dbo].[VesselLines] ([VesselLineName], [Link], [IsDynamicLink])
    VALUES
        ('Maersk Line', 'https://www.maersk.com/schedules/vesselSchedules?vesselCode={0}', 1),
        ('MSC', 'https://www.msc.com/en/search-vessels?vessel={0}', 1),
        ('CMA CGM', 'https://www.cma-cgm.com/ebusiness/vessel/vessel-details/{0}', 1),
        ('COSCO Shipping', NULL, 0),
        ('Hapag-Lloyd', NULL, 0)
END
GO

-- Sample Vessels for each VesselLine
IF NOT EXISTS (SELECT * FROM [dbo].[Vessels])
BEGIN
    INSERT INTO [dbo].[Vessels] ([VesselName], [VesselLineID], [IMO], [MMSI])
    VALUES
        ('Maersk Madrid', 1, '9778131', '219094000'),
        ('Maersk Seville', 1, '9778143', '219095000'),
        ('MSC Gülsün', 2, '9839430', '371180000'),
        ('MSC Mia', 2, '9839442', '371178000'),
        ('CMA CGM Antoine de Saint Exupery', 3, '9776418', '228339600'),
        ('CMA CGM Louis Bleriot', 3, '9776420', '228333700'),
        ('COSCO Shipping Universe', 4, '9795477', '477778800'),
        ('COSCO Shipping Nebula', 4, '9795489', '477779900'),
        ('Hapag-Lloyd Hamburg Express', 5, '9775750', '219023491'),
        ('Hapag-Lloyd Tokyo Express', 5, '9775762', '219023492')
END
GO

-- Sample Terminals for each Port
IF NOT EXISTS (SELECT * FROM [dbo].[Terminals])
BEGIN
    INSERT INTO [dbo].[Terminals] ([TerminalName], [PortID], [Link])
    VALUES
        ('APM Terminals Pier 400', 1, 'https://www.pierpass.org/terminals/apm-terminals-pier-400/'),
        ('Yusen Terminals', 1, 'https://www.yti.com/'),
        ('Long Beach Container Terminal', 2, 'https://lbct.com/'),
        ('SSA Terminals Pier A', 2, 'https://www.ssaterm.com/Terminals/pier-a'),
        ('Port Newark Container Terminal', 3, 'https://www.pnct.net/'),
        ('Maher Terminals', 3, 'https://www.maherterminals.com/'),
        ('Garden City Terminal', 4, 'https://gaports.com/facilities/garden-city-terminal/'),
        ('Ocean Terminal', 4, 'https://gaports.com/facilities/ocean-terminal/'),
        ('Terminal 5', 5, 'https://www.nwseaportalliance.com/terminals/t5'),
        ('Terminal 18', 5, 'https://www.nwseaportalliance.com/terminals/t18')
END
GO

PRINT 'Database and schema created successfully!'
GO